import {ColorPicker, ColorPickerChannelSlider, HStack, parseColor} from "@chakra-ui/react";

type Props = {
    rgbaValue: string;
    onColorChange: (selectedColor: string) => void;
};

const ColorPick = ({rgbaValue, onColorChange}: Props) => {
    return (
        <ColorPicker.Root value={parseColor(rgbaValue)} format="rgba" maxW="200px"
                          onValueChange={(e) => onColorChange(e.value.toString("rgb"))}>
            <ColorPicker.HiddenInput/>
            <ColorPicker.Label color="primary.contrast">Color</ColorPicker.Label>
            <ColorPicker.Control>
                <ColorPicker.Trigger/>
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area/>
                    <HStack>
                        <ColorPickerChannelSlider channel="hue"/>
                    </HStack>
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};

export default ColorPick;