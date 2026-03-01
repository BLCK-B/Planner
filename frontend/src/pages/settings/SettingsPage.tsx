import {Box, Button, Card, Flex} from "@chakra-ui/react";
import ErrorModal from "@/components/popover/ErrorModal.tsx";
import HeaderSettingsPage from "@/components/header/HeaderSettingsPage.tsx";
import {ColorModeButton} from "@/components/ui/color-mode.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {mainRoute, router} from "@/routes/__root.tsx";
import FetchRequest from "@/functions/FetchRequest.tsx";

const SettingsPage = () => {

    const commitId = import.meta.env.VITE_COMMIT_ID || 'commitId'

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.navigate({to: mainRoute.fullPath});
        }
    };

    const logout = async () => {
        await FetchRequest("GET", "/auth/logout");
        window.location.href = "https://auth.spruits.eu"
    };

    return (
        <Box w="100vw" h="100dvh" bg="primary.darker" textStyle="body">
            <HeaderSettingsPage/>
            {commitId}
            <Flex p="5px">
                <Card.Root variant="elevated" bg="primary.lighter" w="100%" color="primary.contrast">
                    <Card.Body>
                        <ColorModeButton/>
                        <MyButton type="exit" onClick={goBack}></MyButton>
                        <Button bg="primary.lighter" color="primary.contrast" onClick={logout}>Log out</Button>
                    </Card.Body>
                </Card.Root>
            </Flex>

            <ErrorModal/>
        </Box>
    );
};

export default SettingsPage;