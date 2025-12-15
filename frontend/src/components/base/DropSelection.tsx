import {Select, createListCollection} from "@chakra-ui/react";

type SelectItem = {
    label: string;
    value: string;
};

type Props = {
    items: SelectItem[];
    selected: string;
    onSelect: (selected: string) => void;
    isInactive?: boolean;
    isClearable?: boolean;
}

const DropSelection = ({items, selected, onSelect, isInactive = false, isClearable = false}: Props) => {

    const selectOptions = createListCollection({items});

    const handleValueChange = (details: { value: string[] }) => {
        onSelect(details.value[0]);
    };

    return (
        <Select.Root
            collection={selectOptions}
            value={[selected]}
            size="sm"
            positioning={{placement: "top"}}
            onValueChange={handleValueChange}
        >
            <Select.HiddenSelect/>
            <Select.Control opacity={isInactive ? 0.5 : 1}>
                <Select.Trigger bg="primary.lighter" border="none" h="45px">
                    <Select.ValueText/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    {isClearable && <Select.ClearTrigger/>}
                </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
                <Select.Content bg="primary.lighter" border="1px solid grey" boxShadow="none">
                    {selectOptions.items.map((item) => (
                        <Select.Item item={item} key={item.value}
                                     bg="primary.lighter"
                                     _hover={{bg: "theme.Spruit1", color: "black"}}>
                            {item.label}
                            <Select.ItemIndicator/>
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>

        </Select.Root>
    );
};

export default DropSelection;