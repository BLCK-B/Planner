import {Tabs} from "@chakra-ui/react";
import {MdOutlineChecklist} from "react-icons/md";
import {LuGoal} from "react-icons/lu";

type Props = {
    tabs: string[];
    selected: string;
    valueChanged: (selectedTab: string) => void;
    orientation?: "horizontal" | "vertical";
    responsive?: boolean;
};

const SelectTabs = ({tabs, selected, valueChanged, orientation = "horizontal", responsive = false}: Props) => {

    const getIcon = (tabName: string) => {
        switch (tabName) {
            case "Tasks":
                return <MdOutlineChecklist/>;
            case "Plans":
                return <LuGoal/>;
            default:
                return;
        }
    };

    return (
        <Tabs.Root variant="subtle" orientation={orientation} value={selected}
                   onValueChange={(e) => valueChanged(e.value)}>
            <Tabs.List p="0.5" w="100%" flexDirection={responsive ? {base: "row", sm: "row", md: "column"} : undefined}
                       gap={1}>
                {tabs.map((tab, index) => (
                    <Tabs.Trigger key={index} value={tab} mb="1"
                                  _selected={{
                                      bg: "theme.Spruit1",
                                      color: "black",
                                  }}
                    >
                        {getIcon(tab)}
                        {tab}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
};

export default SelectTabs;