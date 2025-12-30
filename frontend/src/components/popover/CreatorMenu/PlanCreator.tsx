import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
    Textarea,
} from "@chakra-ui/react";
import useSavePlan from "@/queries/UseSavePlan.tsx";
import useDeletePlan from "@/queries/UseDeletePlan.tsx";
import {showPlanCreator, existingPlanForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import {getNewPlan} from "@/types/PlanType.ts";
import ColorPick from "@/components/base/ColorPick.tsx";

const PlanCreator = () => {

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
        <Dialog.Root size={"sm"} open={showDialog} trapFocus={false}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner
                    style={{
                        alignItems: "center",
                        padding: "0.5rem",
                    }}
                >
                    <Dialog.Content bg="primary" color="primary.contrast">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                Plan
                                <Show when={newItem !== getNewPlan()}>
                                    <MyButton type="delete" onClick={deleteItem}/>
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
                            <ColorPick
                                rgbaValue={newItem.data.color}
                                onColorChange={(selected) => {
                                    updateItem("color", selected)
                                }}
                            />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="confirm" onClick={saveItem} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog(false)}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default PlanCreator;