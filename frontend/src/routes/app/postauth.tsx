import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {Box, Button, GridItem, Grid, Stack, Card, Show, Center, Field} from "@chakra-ui/react";
import {PasswordInput} from "@/components/ui/password-input";
import {type SubmitHandler, useForm} from "react-hook-form";
import FetchRequest from "@/functions/FetchRequest.tsx";
import HeaderAuthPage from "@/components/header/HeaderAuthPage.tsx";
import {Alert} from "@chakra-ui/react"
import type {Credentials} from "@/types/Credentials.ts";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {loadEncryptionPhraseQuery} from "../../queries/EncryptionQueries";
import {
    createEncryptionKey,
    decodeFromBase64,
    decryptString,
    encodeToBase64, encryptString,
    generateNewSalt
} from "../../functions/Crypto";

const Postauth = () => {
    const navigate = useNavigate();

    const {data: encryptionPhrase} = useQuery(loadEncryptionPhraseQuery());

    const EXPECTED_PHRASE = 'spruiten' as const;

    const isEncryptionEnabled = () => {
        return encryptionPhrase && encryptionPhrase !== EXPECTED_PHRASE;
    };

    const [infoAlertMessage, setInfoAlertMessage] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Credentials>();

    const encryptAllData = async (encryptedPhrase: string) => {
        if (isEncryptionEnabled()) {
            setInfoAlertMessage("Encryption is already enabled.");
            return;
        }

        const allItemsReencrypted = await FetchRequest("GET", "/users/allUserTasks");
        const allTagsReencrypted = await FetchRequest("GET", "/users/userTags");
        const allWorkItemsReencrypted = await FetchRequest("GET", "/users/userWorkItems");

        // todo: network is not reliable
        // todo: saves {"encryptedPhrase":"+P/...
        await FetchRequest("PUT", "/auth/encryptionPhrase", {encryptedPhrase});
        if (allItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTasks", allItemsReencrypted);
        if (allTagsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTags", allTagsReencrypted);
        if (allWorkItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserWorkItems", allWorkItemsReencrypted);
    };

    const decryptAllData = async () => {
        if (!isEncryptionEnabled()) {
            setInfoAlertMessage("Encryption is already disabled.");
            return;
        }

        const allItemsReencrypted = await FetchRequest("GET", "/users/allUserTasks");
        const allTagsReencrypted = await FetchRequest("GET", "/users/userTags");
        const allWorkItemsReencrypted = await FetchRequest("GET", "/users/userWorkItems");

        // todo crypto.clearKey();
        // todo: network is not reliable
        // todo: saves {"encryptedPhrase":"+P/...
        // await FetchRequest("PUT", "/auth/encryptionPhrase", {EXPECTED_PHRASE});
        // if (allItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTasks", allItemsReencrypted);
        // if (allTagsReencrypted) await FetchRequest("PUT", "/users/updateAllUserTags", allTagsReencrypted);
        // if (allWorkItemsReencrypted) await FetchRequest("PUT", "/users/updateAllUserWorkItems", allWorkItemsReencrypted);
    };

    const onSubmit: SubmitHandler<Credentials> = async (credentials: Credentials) => {
        try {
            setInfoAlertMessage("");

            let encryptionKeySalt = await FetchRequest("GET", `/auth/encryptionKeySalt`);
            if (!encryptionKeySalt) {
                const newEncryptionKeySalt = encodeToBase64(generateNewSalt());
                encryptionKeySalt = await FetchRequest("POST", `/auth/registerUserSalt`, {newEncryptionKeySalt});
            }

            await createEncryptionKey(decodeFromBase64(encryptionKeySalt), credentials.encryptionPassword);

            if (isEncryptionEnabled()) {
                if (!encryptionPhrase) {
                    setInfoAlertMessage("Missing encryption phrase.");
                    return;
                }
                if (await decryptString(encryptionPhrase) !== EXPECTED_PHRASE) {
                    setInfoAlertMessage("Invalid credentials.");
                    return;
                }
                await decryptAllData();
            } else {
                const encryptedPhrase = await encryptString(EXPECTED_PHRASE);
                await encryptAllData(encryptedPhrase);
            }

            await navigate({to: '/app/tasks'});
            // eslint-disable-next-line
        } catch (error: any) {
            if (error?.status) {
                setInfoAlertMessage("Invalid credentials.");
            } else {
                alert("Operation failed: " + (error?.error || "Unknown error"));
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

                                </Card.Title>
                                <Card.Description color="white">
                                    <Show when={!isEncryptionEnabled()}>
                                        Encryption not enabled. Enter a new encryption password.
                                    </Show>
                                    <Show when={isEncryptionEnabled()}>
                                        Encryption enabled.
                                    </Show>
                                </Card.Description>
                            </Card.Header>
                            <Card.Body gap="2" color="white">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="4" align="flex-start" maxW="sm">
                                        <Field.Root invalid={!!errors.encryptionPassword}>
                                            <PasswordInput {...register("encryptionPassword", {required: "Encryption password is required"})} />
                                            <Field.ErrorText>{String(errors.encryptionPassword?.message)}</Field.ErrorText>
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

export const Route = createFileRoute('/app/postauth')({
    component: Postauth,
})