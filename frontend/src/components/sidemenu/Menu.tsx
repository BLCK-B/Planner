import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useRouter} from '@tanstack/react-router';
import {useAtom} from 'jotai';
import {activePage} from "@/global/atoms.ts";
import {mainRoute, plansRoute} from "@/routes/__root.tsx";
import {Box, Show, useBreakpointValue} from "@chakra-ui/react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";

const Menu = () => {

    const router = useRouter();

    const tabs = ["Tasks", "Plans", "Tab 3"];

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

    return (
        <Box>
            <Show when={isLargeScreen}>
                <Box m="0.5rem">
                    <PlannerLogo/>
                </Box>
            </Show>
            <SelectTabs tabs={tabs} selected={selectedTab} valueChanged={tabSelected} orientation={"vertical"}
                        responsive={true}/>
        </Box>
    );
};

export default Menu;
