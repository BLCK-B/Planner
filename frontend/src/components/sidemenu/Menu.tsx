import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useRouter} from '@tanstack/react-router';
import {useAtom} from 'jotai';
import {activePage} from "@/global/atoms.ts";
import {mainRoute, plansRoute} from "@/routes/__root.tsx";
import {Box, Flex, Show, useBreakpointValue} from "@chakra-ui/react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import ActionButtonsMainPage from "@/components/actions/ActionButtonsMainPage.tsx";
import ActionButtonsPlansPage from "@/components/actions/ActionButtonsPlansPage.tsx";
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
        <Box mt="10px" bg="primary" borderRadius="5px">
            {
                router.state.location.pathname === '/tagsEdit' ? <ActionButtonsTagsEditPage/> :
                    selectedTab === 'Tasks' ? <ActionButtonsMainPage/> :
                        selectedTab === 'Plans' ? <ActionButtonsPlansPage/> :
                            null
            }
        </Box>
    );

    return (
        <Box>
            <Box bg="primary" borderRadius="5px" p="5px">
                {!isLargeScreen &&
                    <Flex justifyContent="center" paddingBottom="5px" bg="primary">{actionButtons}</Flex>}

                <Show when={isLargeScreen}>
                    <Box m="0.5rem">
                        <PlannerLogo/>
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
