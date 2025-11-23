import {Dialog, Portal, Flex, Input, Show, Box, Field, Tag, Popover} from "@chakra-ui/react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import useDeleteTask from "@/queries/UseDeleteTask.tsx";
import {showAddDialog, existingItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import SelectTabs from "@/components/base/SelectTabs.tsx";
import {getNewTask} from "@/types/Task.ts";
import MyButton from "@/components/base/MyButton.tsx";
import DropSelection from "@/components/base/DropSelection.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getDayNumber} from "@/functions/Dates.tsx";
import TagsSelect from "@/components/popover/CreatorMenu/TagsSelect.tsx";
import MyTag from "@/components/items/MyTag.tsx";
import type {TagType} from "@/types/TagType.ts";
import type {PlanType} from "@/types/PlanType.ts";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";

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

    const disableSaveRules = () => {
        return !newItem.data.name || (newItem.data.itemType === "Task" && !newItem.data.date);
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
        {label: "Repeat every week", value: "week"},
        {label: "Repeat every 2 weeks", value: "two-weeks"},
        {label: "Repeat every month", value: "month"},
    ];

    const setEventRepeat = (repeat: string) => {
        updateItem("repeatOriginDay", getDayNumber(newItem.data.date));
        updateItem("repeatEvent", repeat);
    };

    const planOptions = plans?.map(plan => ({
        label: plan.data.name,
        value: plan.planID,
    })) ?? [];

    const setAssignedPlanTask = async (planID: string) => {
        if (!plans) return;
        updateItem("plan", plans.find(plan => plan.planID === planID));
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner
                    style={{
                        alignItems: "center",
                        padding: "0.5rem"
                    }}
                >
                    <Dialog.Content bg="primary.base" color="primary.contrast" height="25rem">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                <SelectTabs tabs={["Task", "Goal"]} selected={newItem.data.itemType}
                                            valueChanged={(value) => updateItem("itemType", value)}/>
                                <Show when={newItem !== getNewTask()}>
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
                                                           onSelect={(repeat) => setEventRepeat(repeat)}
                                                           placeholderText="No repeat"
                                            />
                                        </Box>
                                    </Flex>
                                </Show>
                                {/* tags */}
                                <Popover.Root positioning={{placement: "bottom-start"}}>
                                    <Popover.Trigger asChild>
                                        <Flex gap={1} h="1rem">
                                            {/* tag list */}
                                            {newItem.data.tags.map((tag, index) => (
                                                <MyTag key={index} tag={tag}/>
                                            ))}
                                            {/* button for opening tag add menu */}
                                            <Show when={newItem.data.tags.length === 0}>
                                                <Tag.Root variant="surface" bg="theme.Spruit1"
                                                          color="primary.contrast"
                                                          h="25px" boxShadow="none">
                                                    <Tag.Label>assign tags</Tag.Label>
                                                </Tag.Root>
                                            </Show>
                                        </Flex>
                                    </Popover.Trigger>
                                    <TagsSelect updateTags={(tag) => assignTag(tag)}/>
                                </Popover.Root>
                                {/*  plans select  */}
                                <Box w="70%">
                                    <DropSelection items={planOptions}
                                                   selected={newItem.data.plan?.planID ?? ''}
                                                   onSelect={(planID) => setAssignedPlanTask(planID)}
                                                   placeholderText="Assign to plan"
                                    />
                                </Box>
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
