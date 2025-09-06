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
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import ButtonCancel from "@/components/base/ButtonCancel.tsx";

const CreatorMenu = () => {

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showPlanCreator);

    const [newPlan, setNewPlan] = useAtom(existingPlanForEdit);

    const savePlanMutation = useSavePlan();

    const deletePlanMutation = useDeletePlan();

    const updateItem = (key: keyof typeof newPlan.data, value: any) => {
        setNewPlan(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const saveItem = async () => {
        await savePlanMutation.mutateAsync(newPlan);
        setNewPlan(newPlan);
        setShowDialog(false);

        const queryKey = loadItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteItem = async () => {
        await deletePlanMutation.mutateAsync(newPlan);
        setNewPlan(newPlan);
        setShowDialog(false);
    };

    const disableSaveRules = () => {
        return !newPlan.data.name;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                Plan
                                <Show when={newPlan !== newPlan}>
                                    <ButtonDelete onClick={deleteItem}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap="6" align="start" justifyContent="start" direction="column">
                                <Field.Root invalid={!newPlan.data.name}>
                                    <Input p="2px" variant="subtle" value={newPlan.data.name}
                                           placeholder="Task name"
                                           onChange={(e) => updateItem("name", e.target.value)}/>
                                </Field.Root>
                                <Field.Root>
                                    <Textarea p="2px" h="100px" variant="subtle" value={newPlan.data.description}
                                              placeholder="Description"
                                              onChange={(e) => updateItem("description", e.target.value)}/>
                                </Field.Root>
                            </Flex>
                            <ColorPicker.Root value={parseColor(newPlan.data.color)} format="rgba" maxW="200px"
                                              onValueChange={(e) => updateItem("color", e.value.toString("rgb"))}>
                                <ColorPicker.HiddenInput/>
                                <ColorPicker.Label>Color</ColorPicker.Label>
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