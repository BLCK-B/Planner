import SelectTabs from "@/components/base/SelectTabs.tsx";
import {useNavigate} from "react-router-dom";
import {useAtom} from 'jotai';
import {activePage} from "@/global/atoms.ts";

const Menu = () => {

    const navigate = useNavigate();

    const tabs = ["Tasks", "Plans", "Tab 3"];

    const [selectedTab, setSelectedTab] = useAtom(activePage);

    const tabSelected = (tab: string) => {
        setSelectedTab(tab);
        switch (tab) {
            case tabs[0]:
                navigate("/main");
                break;
            case tabs[1]:
                navigate("/plans");
                break;
            case tabs[2]:
                navigate("/main");
                break;
        }
    };

    return (
        <SelectTabs tabs={tabs} selected={selectedTab} valueChanged={tabSelected} orientation={"vertical"}
                    responsive={true}/>
    );
};

export default Menu;
