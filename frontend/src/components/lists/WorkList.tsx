import {Accordion, Box, Flex, Span} from "@chakra-ui/react";
import WorkItem from "@/components/items/WorkItem.tsx";
import {useQuery} from "@tanstack/react-query";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";

const WorkList = () => {

    const {data: workItems} = useQuery(loadWorkItemsQuery());

    if (!workItems) return <div>Loading...</div>;

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}} mx="auto"
                     position="relative" top="4.8rem"
                     paddingBottom="100px" animation="fade-in 0.05s">
                    <Accordion.Root multiple defaultValue={["b"]}>
                        {workItems.map((item, index) => (
                            <Accordion.Item key={index} value={item.itemID}
                                            mt="0.6rem"
                                            borderRadius="md" p="0.3rem" bg="primary.darker">
                                <Accordion.ItemTrigger p="0.3rem">
                                    <Span flex="1">{item.data.name}</Span>
                                    <Accordion.ItemIndicator color="primary.lighterer"/>
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    <Accordion.ItemBody>
                                        <WorkItem workItem={item}/>
                                    </Accordion.ItemBody>
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                </Box>
            </Box>
        </Flex>
    );
};

export default WorkList;