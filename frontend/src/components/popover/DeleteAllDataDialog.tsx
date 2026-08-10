import {Button, Checkbox, Dialog, Flex, Portal, Text} from "@chakra-ui/react";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";
import {loadCompletedItemsQuery, loadUncompletedItemsQuery} from "@/queries/LoadItemsQueries.tsx";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";

const DeleteAllDataDialog = () => {

    const [confirmed, setConfirmed] = useState(false);

    const queryClient = useQueryClient();

    const deleteAllData = async (setOpen: (open: boolean) => void) => {
        await FetchRequest("DELETE", "/users/removeAllUserData");
        setOpen(false);

        await queryClient.invalidateQueries({queryKey: loadCompletedItemsQuery().queryKey});
        await queryClient.invalidateQueries({queryKey: loadUncompletedItemsQuery().queryKey});
        await queryClient.invalidateQueries({queryKey: loadTagsQuery().queryKey});
        await queryClient.invalidateQueries({queryKey: loadWorkItemsQuery().queryKey});
    };

    return (
        <Dialog.Root size={"md"} trapFocus={false} onOpenChange={() => setConfirmed(false)}>
            <Dialog.Trigger asChild>
                <Button bg="theme.Reddish" color="black" _hover={{bg: "theme.ReddishHover"}}>
                    Delete all data
                </Button>
            </Dialog.Trigger>
            <Dialog.Context>
                {(dialog) => (
                    <Portal>
                        <DialogBackdrop/>
                        <Dialog.Positioner>
                            <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                                <Dialog.Header>
                                    <Flex justifyContent="space-between" w="100%">
                                        Delete all data
                                    </Flex>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Flex direction="column" gap="1.2rem">
                                        <Text>
                                            This will permanently delete all your tasks, tags and worklists. This action
                                            cannot be undone.
                                        </Text>
                                        <Checkbox.Root
                                            checked={confirmed}
                                            onCheckedChange={(e) => setConfirmed(e.checked === true)}
                                            variant="subtle"
                                        >
                                            <Checkbox.HiddenInput/>
                                            <Checkbox.Control
                                                bg="primary.lighter"
                                                _checked={{bg: "theme.Spruit1", color: "black"}}
                                            />
                                            <Checkbox.Label>
                                                I understand that all my data will be deleted
                                            </Checkbox.Label>
                                        </Checkbox.Root>
                                    </Flex>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <MyButton type="delete" onClick={() => deleteAllData(dialog.setOpen)}
                                              disabled={!confirmed}/>
                                    <MyButton type="cancel" onClick={() => dialog.setOpen(false)}/>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                )}
            </Dialog.Context>
        </Dialog.Root>
    );
};

export default DeleteAllDataDialog;