import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
} from "@chakra-ui/react";
import useSaveTag from "@/queries/UseSaveTag.tsx";
// import useDeleteTag from "@/queries/UseDeleteTag.tsx";
import {showTagCreator, existingTagForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import ColorPick from "@/components/base/ColorPick.tsx";
import MyTag from "@/components/items/MyTag.tsx";

const TagCreator = () => {

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showTagCreator);

    const [newTag, setNewTag] = useAtom(existingTagForEdit);

    const saveTagMutation = useSaveTag();

    // const deleteTagMutation = useDeleteTag();

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
        // await deleteTagMutation.mutateAsync(newTag);
        setNewTag(newTag);
        setShowDialog(false);
    };

    const disableSaveRules = () => {
        return !newTag.data.tagName;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary.base" color="primary.contrast">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                <Show when={newTag.data.tagName}>
                                    <MyTag name={newTag.data.tagName} bg={newTag.data.color}/>
                                </Show>
                                <Show when={!newTag.data.tagName}>
                                    New tag
                                </Show>
                                <Show when={newTag !== newTag}>
                                    <MyButton type="delete" onClick={deleteTag}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap="6">
                                <Field.Root invalid={!newTag.data.tagName}>
                                    <Input p="2px" variant="subtle" value={newTag.data.tagName}
                                           placeholder="Tag name"
                                           onChange={(e) => updateTag("tagName", e.target.value)}
                                           bg="primary.lighter" w="10rem"/>
                                </Field.Root>
                                <ColorPick
                                    rgbaValue={newTag.data.color}
                                    onColorChange={(selected) => {
                                        updateTag("color", selected)
                                    }}
                                />
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