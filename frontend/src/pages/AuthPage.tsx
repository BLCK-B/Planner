import {useParams, useRouter} from '@tanstack/react-router';
import {Box, Button, Input, GridItem, Grid, Stack, Card, Show, Center, Field, Text} from "@chakra-ui/react";
import {PasswordInput} from "@/components/ui/password-input";
import {type SubmitHandler, useForm} from "react-hook-form";
import FetchRequest from "@/functions/FetchRequest.tsx";
import {authRoute, mainRoute} from "@/routes/__root.tsx";
import HeaderAuthPage from "@/components/header/HeaderAuthPage.tsx";
import {
    createEncryptionKey,
    decodeFromBase64,
    deriveAuthHash,
    encodeToBase64,
    generateNewSalt,
} from "@/functions/Crypto.ts";
import {Alert} from "@chakra-ui/react"
import type {BackendCredentials, Credentials} from "@/types/Credentials.ts";
import {useState} from "react";

const AuthPage = () => {
    const {formType} = useParams({from: authRoute.id});

    const router = useRouter();

    const [infoAlertMessage, setInfoAlertMessage] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Credentials>();

    // not ready for protocol migrations
    const reencryptAllData = async () => {
        const allItemsReencrypted = await FetchRequest("GET", "/users/allUserTasks");
        const allPlansReencrypted = await FetchRequest("GET", "/users/userPlans");

        if (allItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTasks", allItemsReencrypted);
        if (allPlansReencrypted) await FetchRequest("PUT", "/users/updateAllUserPlans", allPlansReencrypted);
    };

    const registerNewAccount = async (credentials: Credentials) => {
        try {
            const newAuthSalt = generateNewSalt();
            const newEncryptionKeySalt = generateNewSalt();

            const newFrontendAuthHash = await deriveAuthHash(newAuthSalt, credentials.password);

            const backendCredentials = {
                username: credentials.username,
                frontendPasswordHash: newFrontendAuthHash,
                passwordAuthSalt: encodeToBase64(newAuthSalt),
                encryptionKeySalt: encodeToBase64(newEncryptionKeySalt),
            };
            await sendAuthRequest("/auth/register", backendCredentials);

            await router.navigate({
                to: authRoute.fullPath,
                params: {formType: 'log-in'},
            });
        } catch (error: any) {
            if (error?.status === 409) {
                setInfoAlertMessage("This account already exists.");
            } else if (error?.status) {
                setInfoAlertMessage("Invalid credentials.");
            } else {
                alert("Login failed: " + (error?.error || "Unknown error"));
            }
        }
    };

    const login = async (credentials: Credentials) => {
        try {
            setInfoAlertMessage("");
            const frontendAuthSalt = await FetchRequest("GET", `/auth/authSalt/${credentials.username}`);

            const authHash = await deriveAuthHash(decodeFromBase64(frontendAuthSalt), credentials.password);
            const backendCredentials = {
                username: credentials.username,
                frontendPasswordHash: authHash,
                passwordAuthSalt: encodeToBase64(frontendAuthSalt)
            };

            const encryptionKeySalt = await sendAuthRequest("/auth/login", backendCredentials);
            if (encryptionKeySalt.error) {
                alert("Login failed: " + (encryptionKeySalt?.error || "Unknown error"));
                return;
            }
            await createEncryptionKey(decodeFromBase64(encryptionKeySalt), credentials.password);

            // here is the place to call reencryption
            // await reencryptAllData();

            await router.navigate({to: mainRoute.fullPath});
        } catch (error: any) {
            if (error?.status) {
                setInfoAlertMessage("Invalid credentials.");
            } else {
                alert("Login failed: " + (error?.error || "Unknown error"));
            }
        }
    };

    const onSubmit: SubmitHandler<Credentials> = async (credentials: Credentials) => {
        if (formType === "log-in") await login(credentials);
        else if (formType === "register") await registerNewAccount(credentials);
    };

    const sendAuthRequest = async (request: string, credentials: BackendCredentials) => {
        return await FetchRequest("POST", request, {...credentials});
    };

    const switchLoginOrRegister = async () => {
        if (formType === "log-in") {
            await router.navigate({
                to: authRoute.fullPath,
                params: {formType: 'register'},
            });
        } else {
            await router.navigate({
                to: authRoute.fullPath,
                params: {formType: 'log-in'},
            });
        }
    };

    return (
        <Box w="100vw" h="100vh" bg="primary" textStyle="body" backgroundImage="url('/skybg.jpg')"
             bgSize="cover"
             bgRepeat="no-repeat">
            <Grid templateRows="auto 1fr" templateColumns="repeat(1, 1fr)" gap={2} h="100%">

                <GridItem h="3em" colSpan={1} rowSpan={1}>
                    <HeaderAuthPage/>
                </GridItem>

                <Center>
                    <GridItem colSpan={1}>
                        <Card.Root width="320px" variant="elevated" bg="rgba(80, 80, 80, 0.6)"
                                   backdropFilter="blur(100px)" boxShadow="xs">
                            <Card.Header color="white">
                                <Card.Title>
                                    <Text as="span">
                                        {formType === "register" ? "Sign up" : "Log in"}{" "}
                                    </Text>
                                    <Text
                                        as="span"
                                        cursor="pointer"
                                        fontWeight="100"
                                        fontSize="sm"
                                        color="lightgrey"
                                        onClick={switchLoginOrRegister}
                                    >
                                        {formType === "register" ? "/ Log in" : "/ Sign up"}
                                    </Text>
                                </Card.Title>
                                <Card.Description color="white">
                                    {formType === "register" ? "Create an account." : "Welcome back."}
                                </Card.Description>
                            </Card.Header>
                            <Card.Body gap="2" color="white">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="4" align="flex-start" maxW="sm">

                                        <Field.Root invalid={!!errors.username}>
                                            <Field.Label>E-mail</Field.Label>
                                            <Input
                                                color="white" _placeholder={{color: "lightgrey"}}
                                                placeholder="me@example.com" {...register("username", {required: "Username is required"})} />
                                            <Field.ErrorText>{String(errors.username?.message)}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.password}>
                                            <Field.Label color="white">Password</Field.Label>
                                            <PasswordInput {...register("password", {required: "Password is required"})} />
                                            <Field.ErrorText>{String(errors.password?.message)}</Field.ErrorText>
                                        </Field.Root>

                                        <Button type="submit" alignSelf="center" variant="subtle">Submit</Button>
                                        {/*<Show when={formType === "log-in"}>Forgot password</Show>*/}

                                    </Stack>
                                </form>
                            </Card.Body>
                        </Card.Root>
                        <Show when={infoAlertMessage}>
                            <Alert.Root status="error" bg="theme.Reddish" color="white" mt="1rem">
                                <Alert.Indicator/>
                                <Alert.Content>
                                    <Alert.Description>
                                        {infoAlertMessage}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        </Show>
                    </GridItem>
                </Center>
            </Grid>
        </Box>
    );
};

export default AuthPage;
