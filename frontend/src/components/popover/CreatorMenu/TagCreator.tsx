import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field, Box, Textarea,
    Checkbox, useBreakpointValue,
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
import {getNewTag} from "@/types/TagType.ts";
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

    const updateTag = (key: keyof typeof newTag.data, value: any) => {
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
        setShowDialog(false);

        const queryKey = loadTagsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteTag = async () => {
        await deleteTagMutation.mutateAsync(newTag);
        setNewTag(newTag);
        setShowDialog(false);
    };

    const disableSaveRules = () => {
        return !newTag.data.tagName || newTag.data.tagName.length >= 15 || newTag.data.description.length >= 120;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog} trapFocus={false}>
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
                                {/*TODO: detect new vs not new, or via param, for all creators*/}
                                <Show when={newTag !== newTag}>
                                    <MyButton type="delete" onClick={deleteTag}/>
                                </Show>
                                <Show when={newTag !== getNewTag()}>
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
                                    <Checkbox.Root variant="solid" size="sm" checked={newTag.data.isTracked}
                                                   onCheckedChange={() => updateTag("isTracked", !newTag.data.isTracked)}>
                                        <Checkbox.HiddenInput/>
                                        <Checkbox.Control/>
                                        <Checkbox.Label>Show in Plans</Checkbox.Label>
                                    </Checkbox.Root>
                                </Flex>
                                <Field.Root>
                                    <Textarea p="2px" h="100px" variant="subtle" value={newTag.data.description}
                                              placeholder="Description"
                                              onChange={(e) => updateTag("description", e.target.value)}
                                              bg="primary.lighter"/>
                                </Field.Root>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="confirm" onClick={saveTag} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog(false)}/>
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