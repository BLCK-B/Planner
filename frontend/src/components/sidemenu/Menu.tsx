import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useRouter} from '@tanstack/react-router';
import {mainRoute, plansRoute, worklistRoute} from "@/routes/__root.tsx";
import {Box, Center, Flex, Show} from "@chakra-ui/react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import ActionButtonsMainPage from "@/components/actions/ActionButtonsMainPage.tsx";
import ActionButtonsWorklistPage from "@/components/actions/ActionButtonsWorklistPage.tsx";
import {getTabs, mapPathToName, type Tabs} from "@/types/Tabs.ts";

const Menu = ({isDesktop}: { isDesktop: boolean }) => {

    const router = useRouter();

    const tabSelected = (tab: Tabs) => {
        switch (tab) {
            case 'Tasks':
                router.navigate({to: mainRoute.fullPath});
                break;
            case 'Plans':
                router.navigate({to: plansRoute.fullPath});
                break;
            case 'Worklist':
                router.navigate({to: worklistRoute.fullPath});
                break;
        }
    };

    const actionButtons = (
        <Flex mt="5px" bg="primary" borderRadius="md" justifyContent="center">
            {
                router.state.location.pathname === '/app/tasks' ? <ActionButtonsMainPage isDesktop={isDesktop}/> :
                    router.state.location.pathname === '/app/worklist' ? <ActionButtonsWorklistPage/> :
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
