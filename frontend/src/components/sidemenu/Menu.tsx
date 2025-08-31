import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useRouter} from '@tanstack/react-router';
import {useAtom} from 'jotai';
import {activePage} from "@/global/atoms.ts";

const Menu = () => {

    const router = useRouter();

    const tabs = ["Tasks", "Plans", "Tab 3"];

    const [selectedTab, setSelectedTab] = useAtom(activePage);

    const tabSelected = (tab: string) => {
        setSelectedTab(tab);
        switch (tab) {
            case tabs[0]:
                router.navigate({to: "/main"});
                break;
            case tabs[1]:
                router.navigate({to: "/plans"});
                break;
            case tabs[2]:
                router.navigate({to: "/main"});
                break;
        }
    };

    return (
        <SelectTabs tabs={tabs} selected={selectedTab} valueChanged={tabSelected} orientation={"vertical"}
                    responsive={true}/>
    );
};

export default Menu;
