import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Box,
    Field,
    useBreakpointValue,
    Spacer,
    Textarea,
    IconButton
} from "@chakra-ui/react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import useDeleteTask from "@/queries/UseDeleteTask.tsx";
import {showAddDialog, existingItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import {getNewTask} from "@/types/TaskType.ts";
import MyButton from "@/components/base/MyButton.tsx";
import DropSelection from "@/components/base/DropSelection.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getDayNumber} from "@/functions/Dates.tsx";
import MyTag from "@/components/items/MyTag.tsx";
import type {TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {router, tagsEditRoute} from "@/routes/__root.tsx";
import {FaStar} from "react-icons/fa6";
import {MdEventRepeat} from "react-icons/md";

const TaskCreator = () => {

    const isDesktop = useBreakpointValue({base: false, sm: true, md: true}) as boolean;

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showAddDialog);

    const [newItem, setNewItem] = useAtom(existingItemForEdit);

    const saveTaskMutation = useSaveTask();

    const deleteTaskMutation = useDeleteTask();

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

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
        await saveTaskMutation.mutateAsync(newItem);
        setNewItem(getNewTask());
        setShowDialog(false);

        const queryKey = loadItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteItem = async () => {
        await deleteTaskMutation.mutateAsync(newItem);
        setNewItem(getNewTask());
        setShowDialog(false);
    };

    const inactiveDateStyle = () => {
        return !newItem.data.date;
    };

    const invalidNameRule = () => {
        return !newItem.data.name || newItem.data.name.length > 120;
    }

    const disableSave = () => {
        return invalidNameRule();
    };

    const updateDate = (date: string) => {
        if (!date) {
            updateItem("repeatEvent", "none");
        }
        updateItem("date", date);
    };

    const assignTag = (tag: TagType) => {
        const existingTags = newItem.data.tags ?? [];
        const isAssigned = existingTags.some(t => t.tagID === tag.tagID);
        let updatedTags;
        if (isAssigned) {
            updatedTags = existingTags.filter(t => t.tagID !== tag.tagID);
        } else {
            updatedTags = [...existingTags, tag];
        }
        updateItem("tags", updatedTags);
    };

    const repeatOptions = [
        {label: "No repeat", value: "none"},
        {label: "Every week", value: "week"},
        {label: "Every 2 weeks", value: "two-weeks"},
        {label: "Every month", value: "month"},
    ];

    const setEventRepeat = (repeat: string) => {
        updateItem("repeatOriginDay", getDayNumber(newItem.data.date));
        updateItem("repeatEvent", repeat);
    };

    const isTagInactive = (tag: TagType) => {
        const assigned = newItem.data.tags ?? [];
        return !assigned.some(t => t.tagID === tag.tagID);
    }

    const goToTagEditPage = () => {
        router.navigate({to: tagsEditRoute.fullPath});
    };

    const importantStyle = () => {
        return newItem.data.important ? "theme.BrightYellow" : "primary.lighterer";
    }

    return (
        <Dialog.Root size={"sm"} open={showDialog} trapFocus={false}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner style={isDesktop ? styles.dialogDesktop : styles.dialogMobile}>
                    <Dialog.Content bg="primary" color="primary.contrast" boxShadow="none"
                                    textStyle="body">
                        <Dialog.Body mt="1.2rem" p={isDesktop ? undefined : "0.3rem"}>
                            <Flex gap="6" align="start" justifyContent="start" direction="column">
                                <Flex gap="1.2rem" w="100%" align="center">
                                    <Field.Root>
                                        <Textarea p="0.3rem" variant="subtle" value={newItem.data.name}
                                                  placeholder="Task name"
                                                  onChange={(e) => updateItem("name", e.target.value)}
                                                  bg="primary.lighter" resize="none" autoresize
                                        />
                                    </Field.Root>
                                    <IconButton
                                        marginRight="0.6rem"
                                        onClick={() => updateItem("important", !newItem.data.important)}
                                        size="xs"
                                        aria-label={"important"}
                                        bg={importantStyle()}
                                        color="black"
                                    >
                                        <FaStar/>
                                    </IconButton>
                                </Flex>
                                <Flex w="100%" align="center" gap="1.2rem" wrap="wrap">
                                    <Box w="140px">
                                        <Field.Root>
                                            <Input p="0.3rem" variant="subtle" type="date" bg="primary.lighter"
                                                   opacity={inactiveDateStyle() ? 0.5 : 1}
                                                   value={newItem.data.date}
                                                   onChange={(e) => updateDate(e.target.value)}/>
                                        </Field.Root>
                                    </Box>
                                    <Show when={!inactiveDateStyle()}>
                                        <Box w="150px" textOverflow="clip">
                                            <DropSelection items={repeatOptions}
                                                           selected={newItem.data.repeatEvent}
                                                           onSelect={(repeat) => setEventRepeat(repeat)}
                                                           isInactive={newItem.data.repeatEvent === "none"}
                                                           selectIcon={<MdEventRepeat size="1rem"/>}
                                            />
                                        </Box>
                                    </Show>
                                </Flex>
                                {/* tags */}
                                <Flex w="100%" align="center" bg="primary.lighter" p="0.6rem" borderRadius="md"
                                      justify="space-between">
                                    <Flex wrap="wrap" gap={2}>
                                        {tags?.map((tag, i) => (
                                            <Box key={i} onClick={() => assignTag(tag)}>
                                                <MyTag
                                                    tag={tag}
                                                    isEditable={false}
                                                    isInactive={isTagInactive(tag)}
                                                />
                                            </Box>
                                        ))}
                                    </Flex>
                                    <Box ml="10px" right="0">
                                        <MyButton type="tagedit" onClick={goToTagEditPage}/>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Show when={newItem !== getNewTask()}>
                                <MyButton type="delete" onClick={deleteItem}/>
                                <Spacer/>
                            </Show>
                            <MyButton type="confirm" onClick={saveItem} disabled={disableSave()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog(false)}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default TaskCreator;

const styles = {
    dialogMobile: {
        alignItems: "center",
        padding: "0"
    },
    dialogDesktop: {
        alignItems: "center",
        padding: "0.6rem"
    },
};
