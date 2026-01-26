import {Box, Card, Flex} from "@chakra-ui/react";
import ErrorModal from "@/components/popover/ErrorModal.tsx";
import HeaderSettingsPage from "@/components/header/HeaderSettingsPage.tsx";
import {ColorModeButton} from "@/components/ui/color-mode.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {mainRoute, router} from "@/routes/__root.tsx";

const SettingsPage = () => {

    const commitId = import.meta.env.VITE_COMMIT_ID || 'commitId'

    const goBack = () => {
        router.navigate({to: mainRoute.fullPath});
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
                    </Card.Body>
                </Card.Root>
            </Flex>

            <ErrorModal/>
        </Box>
    );
};

export default SettingsPage;