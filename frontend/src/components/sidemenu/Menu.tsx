import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useRouter} from '@tanstack/react-router';
import {useAtom} from 'jotai';
import {activePage} from "@/global/atoms.ts";
import {mainRoute, plansRoute} from "@/routes/__root.tsx";
import {Box, Center, Flex, Show, useBreakpointValue} from "@chakra-ui/react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import ActionButtonsMainPage from "@/components/actions/ActionButtonsMainPage.tsx";
import ActionButtonsTagsEditPage from "@/components/actions/ActionButtonsTagsEditPage.tsx";

const Menu = () => {

    const router = useRouter();

    const tabs = ["Tasks", "Plans"];

    const [selectedTab, setSelectedTab] = useAtom(activePage);

    const isLargeScreen = useBreakpointValue({base: false, md: true}) as boolean;

    const tabSelected = (tab: string) => {
        setSelectedTab(tab);
        switch (tab) {
            case tabs[0]:
                router.navigate({to: mainRoute.fullPath});
                break;
            case tabs[1]:
                router.navigate({to: plansRoute.fullPath});
                break;
            case tabs[2]:
                router.navigate({to: mainRoute.fullPath});
                break;
        }
    };

    const actionButtons = (
        <Flex mt="5px" bg="primary" borderRadius="5px" justifyContent="center">
            {
                router.state.location.pathname === '/tagsEdit' ? <ActionButtonsTagsEditPage/> :
                    selectedTab === 'Tasks' ? <ActionButtonsMainPage/> :
                        null
            }
        </Flex>
    );

    return (
        <Box>
            <Box bg="primary" borderRadius="5px" p="0.3rem">
                {!isLargeScreen &&
                    <Flex justifyContent="center" paddingBottom="0.3rem">
                        {actionButtons}
                    </Flex>
                }

                <Show when={isLargeScreen}>
                    <Box m="0.6rem 0.6rem 1.2rem 0.6rem">
                        <Center>
                            <PlannerLogo/>
                        </Center>
                    </Box>
                </Show>

                <SelectTabs
                    tabs={tabs}
                    selected={selectedTab}
                    valueChanged={tabSelected}
                    orientation={"vertical"}
                    responsive={true}
                />
            </Box>

            {isLargeScreen && actionButtons}
        </Box>
    );
};

export default Menu;
