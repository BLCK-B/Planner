import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useNavigate, useRouter} from '@tanstack/react-router';
import {Box, Center, Flex, Show} from "@chakra-ui/react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import ActionButtonsMainPage from "@/components/actionButtons/ActionButtonsMainPage.tsx";
import ActionButtonsWorklistPage from "@/components/actionButtons/ActionButtonsWorklistPage.tsx";
import {getTabs, mapPathToName, type Tabs} from "@/types/Tabs.ts";
import ActionButtonsInitiativesPage from "@/components/actionButtons/ActionButtonsInitiativesPage.tsx";

const Menu = ({isDesktop}: { isDesktop: boolean }) => {

    const router = useRouter();

    const navigate = useNavigate();

    const tabSelected = (tab: Tabs) => {
        switch (tab) {
            case 'Tasks':
                navigate({to: '/app/tasks'})
                break;
            case 'Worklist':
                navigate({to: '/app/worklist'})
                break;
            case 'Initiatives':
                navigate({to: '/app/initiatives'})
                break;
        }
    };

    const actionButtons = (
        <Flex mt="5px" bg="primary" borderRadius="md" justifyContent="center">
            {
                router.state.location.pathname === '/app/tasks' ? <ActionButtonsMainPage isDesktop={isDesktop}/> :
                    router.state.location.pathname === '/app/worklist' ? <ActionButtonsWorklistPage/> :
                        router.state.location.pathname === '/app/initiatives' ? <ActionButtonsInitiativesPage/> :
                            null
            }
        </Flex>
    );

    return (
        <Box>
            <Box bg="primary" borderRadius="5px" p="0.3rem">
                <Show when={!isDesktop}>
                    <Flex justifyContent="center" paddingBottom="0.3rem">
                        {actionButtons}
                    </Flex>
                </Show>

                <Show when={isDesktop}>
                    <Box m="0.6rem 0.6rem 1.2rem 0.6rem">
                        <Center>
                            <PlannerLogo/>
                        </Center>
                    </Box>
                </Show>

                <SelectTabs
                    tabs={getTabs}
                    selected={mapPathToName(router.state.location.href)}
                    valueChanged={(e) => tabSelected(e as Tabs)}
                    orientation={"vertical"}
                    responsive={true}
                />
            </Box>

            <Show when={isDesktop}>
                {actionButtons}
            </Show>
        </Box>
    );
};

export default Menu;
