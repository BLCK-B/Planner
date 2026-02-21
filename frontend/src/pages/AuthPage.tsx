import {useRouter} from '@tanstack/react-router';
import {Box, Button, GridItem, Grid, Stack, Card, Show, Center, Field} from "@chakra-ui/react";
import {PasswordInput} from "@/components/ui/password-input";
import {type SubmitHandler, useForm} from "react-hook-form";
import FetchRequest from "@/functions/FetchRequest.tsx";
import {mainRoute} from "@/routes/__root.tsx";
import HeaderAuthPage from "@/components/header/HeaderAuthPage.tsx";
import {
    createEncryptionKey,
    decodeFromBase64,
} from "@/functions/Crypto.ts";
import {Alert} from "@chakra-ui/react"
import type {Credentials} from "@/types/Credentials.ts";
import {useState} from "react";

const AuthPage = () => {
    const router = useRouter();

    const [infoAlertMessage, setInfoAlertMessage] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Credentials>();

    // not ready for protocol migrations
    // const reencryptAllData = async () => {
    //     const allItemsReencrypted = await FetchRequest("GET", "/users/allUserTasks");
    //     const allPlansReencrypted = await FetchRequest("GET", "/users/userTags");
    //
    //     if (allItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTasks", allItemsReencrypted);
    //     if (allPlansReencrypted) await FetchRequest("PUT", "/users/updateAllUserTags", allPlansReencrypted);
    // };

    // const registerNewAccount = async (credentials: Credentials) => {
    //     try {
    //         const newAuthSalt = generateNewSalt();
    //         const newEncryptionKeySalt = generateNewSalt();
    //
    //         const newFrontendAuthHash = await deriveAuthHash(newAuthSalt, credentials.encryptionKey);
    //
    //         const backendCredentials = {
    //             frontendPasswordHash: newFrontendAuthHash,
    //             passwordAuthSalt: encodeToBase64(newAuthSalt),
    //             encryptionKeySalt: encodeToBase64(newEncryptionKeySalt),
    //         };
    //         await sendAuthRequest("/auth/register", backendCredentials);
    //
    //         await router.navigate({
    //             to: postAuthRoute.fullPath,
    //             params: {authType: 'log-in'},
    //         });
    //     } catch (error: any) {
    //         if (error?.status === 409) {
    //             setInfoAlertMessage("This account already exists.");
    //         } else if (error?.status) {
    //             setInfoAlertMessage("Invalid credentials.");
    //         } else {
    //             alert("Login failed: " + (error?.error || "Unknown error"));
    //         }
    //     }
    // };

    const onSubmit: SubmitHandler<Credentials> = async (credentials: Credentials) => {
        if (credentials.encryptionKey === "testsentry") {
            await FetchRequest("GET", "/auth/test-sentry");
            return;
        }
        try {
            setInfoAlertMessage("");
            const encryptionKeySalt = await FetchRequest("GET", `/auth/encryptionKeySalt`);

            await createEncryptionKey(decodeFromBase64(encryptionKeySalt), credentials.encryptionKey);

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

    return (
        <Box w="100vw" h="100lvh" bg="primary" textStyle="body" backgroundImage="url('/skybg.jpg')"
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
                                    Log in
                                </Card.Title>
                                <Card.Description color="white">
                                    Enter your encryption key.
                                </Card.Description>
                            </Card.Header>
                            <Card.Body gap="2" color="white">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="4" align="flex-start" maxW="sm">
                                        <Field.Root invalid={!!errors.encryptionKey}>
                                            <PasswordInput {...register("encryptionKey", {required: "Encryption key is required"})} />
                                            <Field.ErrorText>{String(errors.encryptionKey?.message)}</Field.ErrorText>
                                        </Field.Root>
                                        <Button type="submit" alignSelf="center" variant="subtle">Submit</Button>
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
