import {Box, Field, Flex, SimpleGrid, Text} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";
import {useSetAtom} from "jotai";
import {existingWorkItemForEdit, showWorkItemCreator} from "@/global/atoms.ts";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import {router, worklistSubtasksRoute} from "@/routes/__root.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import * as React from "react";

const WorkList = () => {

    const setShowAddDialog = useSetAtom(showWorkItemCreator);

    const setEditItem = useSetAtom(existingWorkItemForEdit);

    const {data: workItems} = useQuery(loadWorkItemsQuery());

    if (!workItems) return <></>;

    const openSubtasks = (workItem: WorkItemType) => {
        router.navigate({
            to: worklistSubtasksRoute.fullPath,
            params: {workItemId: workItem.itemID},
        });
    };

    const openEdit = (e: React.MouseEvent<HTMLButtonElement>, workItem: WorkItemType) => {
        e.stopPropagation();
        setEditItem(workItem);
        setShowAddDialog(true);
    };

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <SimpleGrid w={{base: "95%", md: "90%"}} columns={{base: 1, md: 2}} fontSize="md"
                            mx="auto" gap="1.2rem" position="relative" top="4.8rem" paddingBottom="100px">
                    {workItems?.sort((a, b) => a.data.name.localeCompare(b.data.name))
                        .map((item, i) => (
                            <Flex key={i} cursor="pointer" position="relative" boxShadow="xs" p="0.5rem"
                                  borderRadius="md"
                                  flexDirection="column" w="100%" bg="primary.lighter/30"
                                  onClick={() => {
                                      openSubtasks(item)
                                  }}
                            >
                                <Flex justifyContent="space-between" align="center">
                                    <Text fontWeight="bold">{item.data.name}</Text>
                                    <MyButton type='edit' onClick={e => openEdit(e, item)}/>
                                </Flex>
                                <Box w="100%" mx="auto" position="relative" p="0.6rem">
                                    {item.data.subtasks?.slice(0, 5).map((subtask, x) => (
                                        <Flex
                                            key={x}
                                            color="primary.contrast"
                                            position="relative"
                                            justifyContent="space-between"
                                            mb="0.6rem"
                                        >
                                            <Field.Root ml="0.3rem">
                                                <Text lineClamp="2">
                                                    {subtask.data.name}
                                                </Text>
                                            </Field.Root>
                                        </Flex>
                                    ))}
                                </Box>
                            </Flex>

                        ))}
                </SimpleGrid>
            </Box>
        </Flex>
    );
};

export default WorkList;