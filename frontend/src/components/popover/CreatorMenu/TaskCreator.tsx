import {Dialog, Portal, Flex, Input, Show, Box, Field, Tag, Menu, Popover} from "@chakra-ui/react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import useDeleteTask from "@/queries/UseDeleteTask.tsx";
import {showAddDialog, existingItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import SelectTabs from "@/components/base/SelectTabs.tsx";
import EditableTag from "@/components/base/EditableTag.tsx";
import {newTask} from "@/types/Task.ts";
import MyButton from "@/components/base/MyButton.tsx";
import DropSelection from "@/components/base/DropSelection.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getDayNumber} from "@/functions/Dates.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import TagsSelect from "@/components/popover/CreatorMenu/TagsSelect.tsx";

const TaskCreator = () => {

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showAddDialog);

    const [newItem, setNewItem] = useAtom(existingItemForEdit);

    const saveTaskMutation = useSaveTask();

    const deleteTaskMutation = useDeleteTask();

    const {data: plans} = useQuery<PlanType[]>(loadPlansQuery());

    const updateItem = (key: keyof typeof newItem.data, value: any) => {
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    // TODO: not working, instead handleAddTag
    // const addTag = (name: string) => {
    //     const currentTags = newItem.data.tags ?? [];
    //     updateItem("tags", [...currentTags, name]);
    // };

    const addTagAction = () => {

    };

    const handleAddTag = () => {
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: [...(prev.data.tags ?? []), ""],
            },
        }));
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = newItem.data.tags ?? [];
        updateItem("tags", currentTags.filter(tag => tag !== tagToRemove));
    };

    const saveItem = async () => {
        await saveTaskMutation.mutateAsync(newItem);
        setNewItem(newTask);
        setShowDialog(false);

        const queryKey = loadItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteItem = async () => {
        await deleteTaskMutation.mutateAsync(newItem);
        setNewItem(newTask);
        setShowDialog(false);
    };

    const setNewNameAt = (index: number, newName: string) => {
        const newTags = newItem.data.tags;
        newTags[index] = newName;
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: newTags,
            },
        }));
    };

    const disableSaveRules = () => {
        return !newItem.data.name || (newItem.data.itemType === "Task" && !newItem.data.date);
    };

    const repeatOptions = [
        {label: "Repeat every week", value: "week"},
        {label: "Repeat every 2 weeks", value: "two-weeks"},
        {label: "Repeat every month", value: "month"},
    ];

    const planOptions = plans?.map(plan => ({
        label: plan.data.name,
        value: plan.itemID,
    })) ?? [];

    const setEventRepeat = (repeat: string) => {
        updateItem("repeatOriginDay", getDayNumber(newItem.data.date));
        updateItem("repeatEvent", repeat);
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary.base" color="primary.contrast">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                <SelectTabs tabs={["Task", "Goal"]} selected={newItem.data.itemType}
                                            valueChanged={(value) => updateItem("itemType", value)}/>
                                <Show when={newItem !== newTask}>
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
                                <Show when={newItem.data.itemType === "Task"}>
                                    <Flex style={styles.dateFlex}>
                                        <Box w="160px">
                                            <Field.Root invalid={!newItem.data.date}>
                                                <Input p="2px" variant="subtle" type="date" bg="primary.lighter"
                                                       value={newItem.data.date}
                                                       onChange={(e) => updateItem("date", e.target.value)}/>
                                            </Field.Root>
                                        </Box>
                                        <Box w="215px">
                                            <DropSelection items={repeatOptions}
                                                           selected={newItem.data.repeatEvent}
                                                           onSelect={(repeat) => setEventRepeat(repeat)}/>
                                        </Box>
                                    </Flex>
                                </Show>
                                {/* tags */}
                                <Flex>
                                    {/* tag list */}
                                    {newItem.data.tags.map((tagName, index) => (
                                        <EditableTag key={index} name={tagName}
                                                     setNewName={(newName: string) => setNewNameAt(index, newName)}
                                                     deleteTag={removeTag}/>
                                    ))}
                                    {/* button for opening tag add menu */}
                                    <Show when={newItem.data.tags.length <= 2}>
                                        <Popover.Root>
                                            <Popover.Trigger asChild>
                                                <Tag.Root onClick={addTagAction} variant="surface"
                                                          bg="primary.base"
                                                          color="primary.contrast">
                                                    <Tag.Label>+ tag</Tag.Label>
                                                </Tag.Root>
                                            </Popover.Trigger>
                                            <TagsSelect/>
                                        </Popover.Root>
                                    </Show>
                                </Flex>
                                {/* plan assignment */}
                                {/*<DropSelection items={planOptions}*/}
                                {/*               selected={newItem.data.planID}*/}
                                {/*               onSelect={(planID) => updateItem("planID", planID)}/>*/}
                            </Flex>
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

export default TaskCreator;

const styles = {
    dateFlex: {
        position: "relative" as "relative",
        width: "90%",
        gap: "2rem",
    }
};
