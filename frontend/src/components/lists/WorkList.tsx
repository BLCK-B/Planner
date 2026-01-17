import {Accordion, Box, Flex} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";
import {useSetAtom} from "jotai";
import {existingWorkItemForEdit, selectedWorkitem, showWorkItemCreator} from "@/global/atoms.ts";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import {router, worklistSubtasksRoute} from "@/routes/__root.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import * as React from "react";

const WorkList = () => {

    const setShowAddDialog = useSetAtom(showWorkItemCreator);

    const setEditItem = useSetAtom(existingWorkItemForEdit);

    const setSelectedWorkitem = useSetAtom(selectedWorkitem);

    const {data: workItems} = useQuery(loadWorkItemsQuery());

    if (!workItems) return <div>Loading...</div>;

    const openSubtasks = (workItem: WorkItemType) => {
        setSelectedWorkitem(workItem);
        router.navigate({to: worklistSubtasksRoute.fullPath});
    }

    const openEdit = (e: React.MouseEvent<HTMLButtonElement>, workItem: WorkItemType) => {
        e.stopPropagation();
        setEditItem(workItem);
        setShowAddDialog(true);
    };

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}} mx="auto"
                     position="relative" top="4.8rem"
                     paddingBottom="100px" animation="fade-in 0.05s">
                    <Accordion.Root multiple defaultValue={["b"]}>
                        {workItems?.map((item, i) => (
                            <Flex
                                key={i}
                                bg='primary.lighter/70'
                                color="primary.contrast"
                                mb="0.9rem"
                                p="0.5rem"
                                borderRadius="md"
                                cursor="pointer"
                                position="relative"
                                justifyContent="space-between"
                                boxShadow="xs"
                                align="center"
                                onClick={() => {
                                    openSubtasks(item)
                                }}
                                border="2px solid darkgrey"
                            >
                                {item.data.name}
                                {/*{item.data.subtasks?.map((subtask) => (*/}
                                {/*    subtask.data.name*/}
                                {/*))}*/}
                                <MyButton type='edit' onClick={e => openEdit(e, item)}/>
                            </Flex>
                        ))}
                    </Accordion.Root>
                </Box>
            </Box>
        </Flex>
    );
};

export default WorkList;