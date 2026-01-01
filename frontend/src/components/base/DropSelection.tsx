import {Select, createListCollection} from "@chakra-ui/react";
import {MdEventRepeat} from "react-icons/md";
import * as React from "react";

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
    selectIcon?: React.ReactNode;
}

const DropSelection = ({
                           items,
                           selected,
                           onSelect,
                           isInactive = false,
                           isClearable = false,
                           selectIcon = <></>
                       }: Props) => {

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
                    {selectIcon}
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