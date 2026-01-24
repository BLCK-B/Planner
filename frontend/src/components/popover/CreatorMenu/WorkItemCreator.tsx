import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
    useBreakpointValue,
} from "@chakra-ui/react";
import {showWorkItemCreator, existingWorkItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import {getNewWorkItem} from "@/types/WorkItemType.ts";
import useSaveWorkItem from "@/queries/UseSaveWorkItem.tsx";
import useDeleteWorkItem from "@/queries/UseDeleteWorkItem.tsx";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";

const WorkItemCreator = () => {

    const isDesktop = useBreakpointValue({base: false, md: true}) as boolean;

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showWorkItemCreator);

    const [newWorkItem, setNewWorkItem] = useAtom(existingWorkItemForEdit);

    const saveWorkItemMutation = useSaveWorkItem();

    const deleteWorkItemMutation = useDeleteWorkItem();

    const updateWorkItem = (key: keyof typeof newWorkItem.data, value: any) => {
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
        setShowDialog(false);

        const queryKey = loadWorkItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteWorkItem = async () => {
        await deleteWorkItemMutation.mutateAsync(newWorkItem);
        setNewWorkItem(newWorkItem);
        setShowDialog(false);
    };

    const disableSaveRules = () => {
        return !newWorkItem.data.name;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog} trapFocus={false}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner style={isDesktop ? styles.dialogDesktop : styles.dialogMobile}>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                New worklist
                                {/*TODO: detect new vs not new, or via param, for all creators*/}
                                <Show when={newWorkItem !== getNewWorkItem()}>
                                    <MyButton type="delete" onClick={deleteWorkItem}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Field.Root invalid={!newWorkItem.data.name}>
                                <Input p="2px" variant="subtle" value={newWorkItem.data.name}
                                       placeholder="Work item name"
                                       onChange={(e) => updateWorkItem("name", e.target.value)}
                                       bg="primary.lighter"/>
                            </Field.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="confirm" onClick={saveWorkItem} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog(false)}/>
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