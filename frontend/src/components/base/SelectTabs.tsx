import {Tabs} from "@chakra-ui/react";

type Props = {
    tabs: string[];
    selected: string;
    valueChanged: (selectedTab: string) => void;
};

const SelectTabs = ({tabs, selected, valueChanged}: Props) => {
    return (
        <Tabs.Root variant="subtle" value={selected} onValueChange={(e) => valueChanged(e.value)}>
            <Tabs.List p="1" w="100%">
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