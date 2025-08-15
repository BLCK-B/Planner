import {Select, createListCollection} from "@chakra-ui/react";

type SelectItem = {
    label: string;
    value: string;
};

type Props = {
    items: SelectItem[];
    selectedRepeat: string;
    onSelect: (selected: string) => void;
}

const DropSelection = ({items, selectedRepeat, onSelect}: Props) => {

    const selectOptions = createListCollection({items});

    const handleValueChange = (details: { value: string[] }) => {
        onSelect(details.value[0]);
    };

    return (
        <Select.Root
            collection={selectOptions}
            defaultValue={[selectedRepeat]}
            size="sm"
            positioning={{placement: "top", flip: false}}
            onValueChange={handleValueChange}
        >
            <Select.HiddenSelect/>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="No repeat"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.ClearTrigger/>
                </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
                <Select.Content>
                    {selectOptions.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
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