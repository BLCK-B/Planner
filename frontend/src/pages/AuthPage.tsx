import {useParams, useRouter} from '@tanstack/react-router';
import {Box, Button, Input, GridItem, Grid, Stack, Card, Show, Center, Field} from "@chakra-ui/react";
import {PasswordInput} from "@/components/ui/password-input";
import {type SubmitHandler, useForm} from "react-hook-form";
import FetchRequest from "@/functions/FetchRequest.tsx";
import {authRoute, mainRoute} from "@/routes/__root.tsx";
import HeaderAuthPage from "@/components/header/HeaderAuthPage.tsx";
import {deriveAuthHash, generateNewSalt} from "@/functions/Crypto.ts";

type credentials = {
    username: string;
    password: string;
};

type backendCredentials = {
    username: string;
    passwordHash: string;
    salt: string;
};

const AuthPage = () => {
    const {formType} = useParams({from: authRoute.id});
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<credentials>();

    const registerNewAccount = async (credentials: credentials) => {
        const salt = generateNewSalt();
        const newFrontendAuthHash = deriveAuthHash(salt, credentials.password);

        const backendCredentials = {username: credentials.username, password: newFrontendAuthHash, salt: salt};
        await sendAuthRequest("/auth/register", backendCredentials);

        //     on success, call login()
    };

    const login = async (credentials: credentials) => {
        //    fetch existing auth salt
        //    create frontendauthhash
        //    login using this hash async
        //    assemble encryption key to secure medium
    };

    const createEncryptionKey = async (credentials: credentials) => {

    };

    const onSubmit: SubmitHandler<credentials> = async (credentials: credentials) => {
        if (formType === "log-in") {
            const response = await sendAuthRequest("/auth/login", credentials);
            if (!response.error) {
                await router.navigate({to: mainRoute.fullPath});
            } else {
                alert("Login failed: " + (response?.error || "Unknown error"));
            }
        } else if (formType === "register") registerNewAccount(credentials);
    };

    const sendAuthRequest = async (request: string, credentials: backendCredentials) => {
        const body = {...credentials};
        try {
            return await FetchRequest("POST", request, body);
        } catch (error) {
            if (error instanceof Error) {
                return {error: error.message};
            } else {
                return {error: "An unknown error occurred"};
            }
        }
    };

    return (
        <Box w="100vw" h="100vh" bg="primary.base" textStyle="body">
            <Grid templateRows="auto 1fr" templateColumns="repeat(1, 1fr)" gap={2} h="100%">

                <GridItem h="3em" colSpan={1} rowSpan={1}>
                    <HeaderAuthPage/>
                </GridItem>

                <Center>
                    <GridItem colSpan={1}>
                        <Card.Root width="320px" variant="elevated" bg="primary.lighter">
                            <Card.Header color="primary.contrast">
                                <Show when={formType === "register"}>
                                    <Card.Title>Sign up</Card.Title>
                                    <Card.Description>Create an account.</Card.Description>
                                </Show>
                                <Show when={formType === "log-in"}>
                                    <Card.Title>Log in</Card.Title>
                                    <Card.Description>Welcome back.</Card.Description>
                                </Show>
                            </Card.Header>
                            <Card.Body gap="2" color="primary.contrast">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="4" align="flex-start" maxW="sm">
                                        {/*<OAuthProviders/>*/}

                                        <Field.Root invalid={!!errors.username}>
                                            <Field.Label>E-mail</Field.Label>
                                            <Input
                                                placeholder="me@example.com" {...register("username", {required: "Username is required"})} />
                                            <Field.ErrorText>{String(errors.username?.message)}</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.password}>
                                            <Field.Label>Password</Field.Label>
                                            <PasswordInput {...register("password", {required: "Password is required"})} />
                                            <Field.ErrorText>{String(errors.password?.message)}</Field.ErrorText>
                                        </Field.Root>

                                        <Button type="submit">Submit</Button>

                                        <Show when={formType === "log-in"}>Forgot password</Show>
                                    </Stack>
                                </form>
                            </Card.Body>
                        </Card.Root>
                    </GridItem>
                </Center>
            </Grid>
        </Box>
    );
};

export default AuthPage;
