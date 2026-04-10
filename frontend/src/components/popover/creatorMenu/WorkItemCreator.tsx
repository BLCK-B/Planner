import {
    Dialog,
    Portal,
    Input,
    Show,
    Field,
    useBreakpointValue,
    Spacer
} from "@chakra-ui/react";
import {showWorkItemCreator, existingWorkItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import useSaveWorkItem from "@/queries/UseSaveWorkItem.tsx";
import useDeleteWorkItem from "@/queries/UseDeleteWorkItem.tsx";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";

const WorkItemCreator = () => {
    const isDesktop = useBreakpointValue({base: false, sm: true, md: true}, {ssr: false}) as boolean;

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showWorkItemCreator);

    const [newWorkItem, setNewWorkItem] = useAtom(existingWorkItemForEdit);

    const saveWorkItemMutation = useSaveWorkItem();

    const deleteWorkItemMutation = useDeleteWorkItem();

    const updateWorkItem = (key: keyof typeof newWorkItem.data, value: string) => {
        setNewWorkItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const saveWorkItem = async () => {
        await saveWorkItemMutation.mutateAsync(newWorkItem);
        setNewWorkItem(newWorkItem);
        setShowDialog({show: false, isNew: false});

        const queryKey = loadWorkItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteWorkItem = async () => {
        await deleteWorkItemMutation.mutateAsync(newWorkItem);
        setNewWorkItem(newWorkItem);
        setShowDialog({show: false, isNew: false});
    };

    const disableSaveRules = () => {
        return !newWorkItem.data.name;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog.show} trapFocus={false}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner style={isDesktop ? styles.dialogDesktop : styles.dialogMobile}>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Body mt="1.2rem" p={isDesktop ? undefined : "0.3rem"}>
                            <Field.Root invalid={!newWorkItem.data.name}>
                                <Input p="2px" variant="subtle" value={newWorkItem.data.name}
                                       placeholder="Worklist name"
                                       onChange={(e) => updateWorkItem("name", e.target.value)}
                                       bg="primary.lighter"/>
                            </Field.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Show when={!showDialog.isNew}>
                                <MyButton type="delete" onClick={deleteWorkItem}/>
                                <Spacer/>
                            </Show>
                            <MyButton type="confirm" onClick={saveWorkItem} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog({show: false, isNew: false})}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkItemCreator;

const styles = {
    dialogMobile: {
        alignItems: "center",
        padding: "0"
    },
    dialogDesktop: {
        alignItems: "center",
        padding: "0.5rem"
    }
};