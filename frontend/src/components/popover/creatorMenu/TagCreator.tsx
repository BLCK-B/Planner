import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
    Box,
    useBreakpointValue,
} from "@chakra-ui/react";
import useSaveTag from "@/queries/UseSaveTag.tsx";
import useDeleteTag from "@/queries/UseDeleteTag.tsx";
import {showTagCreator, existingTagForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import ColorPick from "@/components/base/ColorPick.tsx";
import MyTag from "@/components/items/MyTag.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";

const TagCreator = () => {
    const isDesktop = useBreakpointValue(
        {base: false, md: true},
        {ssr: false}
    );

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showTagCreator);

    const [newTag, setNewTag] = useAtom(existingTagForEdit);

    const saveTagMutation = useSaveTag();

    const deleteTagMutation = useDeleteTag();

    const updateTag = (key: keyof typeof newTag.data, value: string) => {
        setNewTag(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const saveTag = async () => {
        await saveTagMutation.mutateAsync(newTag);
        setNewTag(newTag);
        setShowDialog({show: false, isNew: false});

        const queryKey = loadTagsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteTag = async () => {
        await deleteTagMutation.mutateAsync(newTag);
        setNewTag(newTag);
        setShowDialog({show: false, isNew: false});
    };

    const disableSaveRules = () => {
        return !newTag.data.tagName || newTag.data.tagName.length >= 15;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog.show} trapFocus={false}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner style={isDesktop ? styles.dialogDesktop : styles.dialogMobile}>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                <Show when={newTag.data.tagName}>
                                    <MyTag tag={newTag}/>
                                </Show>
                                <Show when={!newTag.data.tagName}>
                                    New tag
                                </Show>
                                <Show when={!showDialog.isNew}>
                                    <MyButton type="delete" onClick={deleteTag}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap="6" align="start" justifyContent="start" direction="column">
                                <Flex gap="6" wrap="wrap">
                                    <Box>
                                        <Field.Root invalid={!newTag.data.tagName}>
                                            <Input p="2px" variant="subtle" value={newTag.data.tagName}
                                                   placeholder="Tag name"
                                                   onChange={(e) => updateTag("tagName", e.target.value)}
                                                   bg="primary.lighter" w="10rem"/>
                                        </Field.Root>
                                    </Box>
                                    <ColorPick
                                        rgbaValue={newTag.data.color}
                                        onColorChange={(selected) => {
                                            updateTag("color", selected)
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="confirm" onClick={saveTag} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog({show: false, isNew: false})}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default TagCreator;

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