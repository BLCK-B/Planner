import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
    Textarea,
    ColorPicker,
    parseColor,
    HStack, ColorPickerChannelSlider,
} from "@chakra-ui/react";
import useSavePlan from "@/queries/UseSavePlan.tsx";
import useDeletePlan from "@/queries/UseDeletePlan.tsx";
import {showPlanCreator, existingPlanForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import ButtonDelete from "@/components/base/ButtonDelete.tsx";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import ButtonCancel from "@/components/base/ButtonCancel.tsx";
import {newPlan} from "@/types/Plan.ts";

const CreatorMenu = () => {

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showPlanCreator);

    const [newItem, setNewItem] = useAtom(existingPlanForEdit);

    const savePlanMutation = useSavePlan();

    const deletePlanMutation = useDeletePlan();

    const updateItem = (key: keyof typeof newItem.data, value: any) => {
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const saveItem = async () => {
        await savePlanMutation.mutateAsync(newItem);
        setNewItem(newItem);
        setShowDialog(false);

        const queryKey = loadPlansQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteItem = async () => {
        await deletePlanMutation.mutateAsync(newItem);
        setNewItem(newItem);
        setShowDialog(false);
    };

    const disableSaveRules = () => {
        return !newItem.data.name;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary.base" color="primary.contrast">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                Plan
                                <Show when={newItem !== newPlan}>
                                    <ButtonDelete onClick={deleteItem}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap="6" align="start" justifyContent="start" direction="column">
                                <Field.Root invalid={!newItem.data.name}>
                                    <Input p="2px" variant="subtle" value={newItem.data.name}
                                           placeholder="Task name"
                                           onChange={(e) => updateItem("name", e.target.value)}
                                           bg="primary.lighter"/>
                                </Field.Root>
                                <Field.Root>
                                    <Textarea p="2px" h="100px" variant="subtle" value={newItem.data.description}
                                              placeholder="Description"
                                              onChange={(e) => updateItem("description", e.target.value)}
                                              bg="primary.lighter"/>
                                </Field.Root>
                            </Flex>
                            <ColorPicker.Root value={parseColor(newItem.data.color)} format="rgba" maxW="200px"
                                              onValueChange={(e) => updateItem("color", e.value.toString("rgb"))}>
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
                        </Dialog.Body>
                        <Dialog.Footer>
                            <ButtonConfirm onClick={saveItem} disabled={disableSaveRules()}/>
                            <ButtonCancel onClick={() => setShowDialog(false)}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CreatorMenu;