import {Box, Button, Card, Flex, Text} from "@chakra-ui/react";
import ErrorModal from "@/components/popover/ErrorModal.tsx";
import HeaderSettingsPage from "@/components/header/HeaderSettingsPage.tsx";
import {ColorModeButton} from "@/components/ui/color-mode.tsx";
import FetchRequest from "@/functions/FetchRequest.tsx";
import {createFileRoute} from "@tanstack/react-router";

const Settings = () => {

    const commitId = import.meta.env.VITE_COMMIT_ID || 'commitId'

    const logout = async () => {
        await FetchRequest("GET", "/auth/logout");
        window.location.href = "https://auth.spruits.eu"
    };

    const goToZitadel = () => {
        window.location.href = "https://auth.spruits.eu"
    };

    return (
        <Box w="100vw" h="100dvh" bg="primary.darker" textStyle="body">
            <HeaderSettingsPage/>
            <Text p="0.6rem" color="primary.lighterer">{commitId}</Text>
            <Flex p="5px" w="100%" align="center" justifyContent="center">
                <Card.Root variant="elevated" bg="primary.lighter" w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}}
                           color="primary.contrast">
                    <Card.Body>
                        <Flex w="100%" align="center" justify="center" direction="column" gap="2.4rem">
                            <ColorModeButton bg="primary"/>
                            <Flex gap="1.2rem">
                                <Button bg="primary" color="primary.contrast" onClick={goToZitadel}>Auth
                                    settings</Button>
                                <Button bg="primary" color="primary.contrast" onClick={logout}>Log out</Button>
                            </Flex>
                        </Flex>
                    </Card.Body>
                </Card.Root>
            </Flex>

            <ErrorModal/>
        </Box>
    );
};

export const Route = createFileRoute('/app/settings')({
    component: Settings,
})