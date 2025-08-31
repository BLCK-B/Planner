import {Tabs} from "@chakra-ui/react";

type Props = {
    tabs: string[];
    selected: string;
    valueChanged: (selectedTab: string) => void;
    orientation?: "horizontal" | "vertical";
    responsive?: boolean;
};

const SelectTabs = ({tabs, selected, valueChanged, orientation = "horizontal", responsive = false}: Props) => {
    return (
        <Tabs.Root variant="subtle" orientation={orientation} value={selected}
                   onValueChange={(e) => valueChanged(e.value)}>
            <Tabs.List p="1" w="100%" flexDirection={responsive ? {base: "row", sm: "row", md: "column"} : undefined}>
                {tabs.map((tab, index) => (
                    <Tabs.Trigger key={index} value={tab} mb="2">
                        {tab}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
};

export default SelectTabs;