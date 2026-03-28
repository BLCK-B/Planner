import {type ConnectableElement, useDrag, useDrop} from "react-dnd";
import type {SubtaskType} from "@/types/SubtaskType.ts";
import {Box, Checkbox, Editable, Flex, Show} from "@chakra-ui/react";
import {getEmptyImage} from "react-dnd-html5-backend";
import {useEffect} from "react";
import MyButton from "@/components/base/MyButton.tsx";

type Props = {
    subtask: SubtaskType;
    index: number;
    moveSubtask: (from: number, to: number) => void;
    updateSubtaskText: (index: number, value: string) => void;
    toggleSubtaskCompleted: (index: number) => void;
    removeSubtask: (index: number) => void;
}

const Subtask = ({subtask, index, moveSubtask, updateSubtaskText, removeSubtask, toggleSubtaskCompleted}: Props) => {
    const dndType = "SUBTASK";

    const [, dragRef, preview] = useDrag({
        type: dndType,
        item: {index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: dndType,
        hover(item: { index: number }) {
            if (item.index !== index) {
                moveSubtask(item.index, index);
                item.index = index;
            }
        },
    });

    // to remove HTML ghost image
    useEffect(() => {
        if (preview) {
            preview(getEmptyImage(), {captureDraggingState: true});
        }
    }, [preview]);

    return (
        <Flex
            ref={(node: ConnectableElement) => {
                dropRef(node)
            }}
            color="primary.contrast"
            borderRadius="md"
            justifyContent="space-between"
            bg="transparent"
            transition="background-color 0.2s ease"
            pr="0.3rem"
            mb="0.3rem"
        >
            <Box
                ref={dragRef}
                userSelect="none"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                cursor="grab"
                p="0.3rem"
            >
                ⋮⋮
            </Box>
            <Editable.Root
                defaultEdit={!subtask.data.name}
                value={subtask.data.name}
                onValueChange={(e) => updateSubtaskText(index, e.value)}
                ml="0.3rem"
                flex="1"
            >
                <Editable.Preview
                    w="100%"
                    _hover={{bg: "primary.lighter"}}
                />
                <Editable.Textarea
                    maxLength={120}
                    w="100%"
                    resize="none"
                    _selection={{bg: "theme.Spruit2", color: "black"}}
                />
            </Editable.Root>
            <Show when={subtask.data.name}>
                <Checkbox.Root
                    checked={subtask.data.completed}
                    onCheckedChange={() =>
                        toggleSubtaskCompleted(index)
                    }
                    variant="subtle"
                >
                    <Checkbox.HiddenInput/>
                    <Checkbox.Control
                        bg="primary.lighter"
                        _checked={{bg: "theme.Spruit1", color: "black"}}
                    />
                </Checkbox.Root>
            </Show>
            <Show when={!subtask.data.name}>
                <Flex align="center">
                    <MyButton type="delete" onClick={() => removeSubtask(index)}
                              extraSmall={true}/>
                </Flex>
            </Show>
        </Flex>
    );
};

export default Subtask;