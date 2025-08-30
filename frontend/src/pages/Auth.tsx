import {useParams, useNavigate} from "react-router-dom";
import {Box, Button, Input, GridItem, Grid, Stack, Card, Show, Center, Field} from "@chakra-ui/react";
import {PasswordInput} from "@/components/ui/password-input";
import Header from "@/components/header/Header.tsx";
import {type SubmitHandler, useForm} from "react-hook-form";
// import OAuthProviders from "@/components/base/OAuthProviders.tsx";
import fetchRequest from "@/scripts/fetchRequest.tsx";

type credentials = {
    username: string;
    password: string;
};

const Auth = () => {
    const {formType} = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<credentials>();

    const onSubmit: SubmitHandler<credentials> = async (data) => {
        if (formType === "log-in") {
            const response = await sendPostRequest("/auth/login", data);
            if (!response.error) {
                navigate("/main");
            } else {
                alert("Login failed: " + (response?.error || "Unknown error"));
            }
        } else if (formType === "register") await sendPostRequest("/auth/register", data);
    };

    const sendPostRequest = async (request: string, content: credentials) => {
        const body = {username: content.username, password: content.password};
        try {
            return await fetchRequest("POST", request, body);
        } catch (error) {
            if (error instanceof Error) {
                return {error: error.message};
            } else {
                return {error: "An unknown error occurred"};
            }
        }
    };

    return (
        <Box w="100vw" h="100vh" bg="base.200" textStyle="body">
            <Grid templateRows="auto 1fr" templateColumns="repeat(1, 1fr)" gap={2} h="100%">
                {/* header */}
                <GridItem h="3em" colSpan={1} rowSpan={1} bg="#dcdcdc">
                    <Header/>
                </GridItem>

                <Center>
                    <GridItem colSpan={1} bg="#dcdcdc">
                        <Card.Root width="320px" variant="elevated">
                            <Card.Header>
                                <Show when={formType === "register"}>
                                    <Card.Title>Sign up</Card.Title>
                                    <Card.Description>Continue with provider or create an account.</Card.Description>
                                </Show>
                                <Show when={formType === "log-in"}>
                                    <Card.Title>Log in</Card.Title>
                                    <Card.Description>Welcome back. Continue with provider or
                                        credentials.</Card.Description>
                                </Show>
                            </Card.Header>
                            <Card.Body gap="2">
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

export default Auth;
