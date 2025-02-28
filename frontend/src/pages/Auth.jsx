import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Input, GridItem, Grid, Stack, Card, Show, Center } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import Header from "../components/Header";
import { useForm } from "react-hook-form";
import OAuthProviders from "../components/OAuthProviders";
import useFetchPost from "../scripts/useFetchPost.jsx";

const Auth = () => {
  // TODO: unrecognised param -> register
  const { formType } = useParams();

  const [request, setRequest] = useState("");
  const [requestBody, setRequestBody] = useState("");

  const sendPostRequest = (request, content) => {
    setRequestBody({ username: content.username, password: content.password });
    setRequest(request);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data, event) => {
    event.preventDefault();
    console.log(data);
    if (formType === "log-in") sendPostRequest("/auth/login", data);
    else if (formType === "register") sendPostRequest("/auth/register", data);
  };

  const { data, loading, error } = useFetchPost(request, setRequest, requestBody);

  return (
    <Box w="100vw" h="100vh" bg="base.200">
      <Grid templateRows="auto 1fr" templateColumns="repeat(1, 1fr)" gap={2} h="100%">
        {/* header */}
        <GridItem h="3em" colSpan={1} rowSpan={1} bg="#dcdcdc">
          <Header />
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
                  <Card.Description>Welcome back. Continue with provider or credentials.</Card.Description>
                  <Checkbox defaultChecked size="sm">
                    Remember me
                  </Checkbox>
                </Show>
              </Card.Header>
              <Card.Body gap="2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap="4" align="flex-start" maxW="sm">
                    <OAuthProviders />

                    <Field label="E-mail" invalid={!!errors.username} errorText={errors.username?.message}>
                      <Input placeholder="me@example.com" {...register("username", { required: "Username is required" })} />
                    </Field>

                    <Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
                      <PasswordInput {...register("password", { required: "Password is required" })} />
                    </Field>

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
