import {Box, Editable, Flex, RatingGroup, Show, Text} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {
    existingInitiativeForEdit,
    showInitiativeCreator,
} from "@/global/atoms.ts";
import MyButton from "@/components/base/MyButton.tsx";
import * as React from "react";
import type {InitiativeType} from "@/types/InitiativeType.ts";
import {useQuery} from "@tanstack/react-query";
import loadInitiativesQuery from "@/queries/LoadloadInitiativesQuery.tsx";
import {useState} from "react";
import useSaveInitiative from "@/queries/UseSaveInitiative.tsx";
import {getNewInitiativeRecord, type InitiativeRecordType} from "@/types/InitiativeRecordType.ts";

const InitiativesList = () => {

    const setShowAddDialog = useSetAtom(showInitiativeCreator);

    const setEditItem = useSetAtom(existingInitiativeForEdit);

    const {data: initiatives} = useQuery(loadInitiativesQuery());

    const saveInitiative = useSaveInitiative();

    const [selectedInitiative, setSelectedInitiative] = useState<InitiativeType | null>(null);

    const [newRecord, setNewRecord] = useState<InitiativeRecordType>(getNewInitiativeRecord);

    const openEdit = (e: React.MouseEvent<HTMLButtonElement>, item: InitiativeType) => {
        e.stopPropagation();
        setEditItem(item);
        setShowAddDialog({show: true, isNew: false});
    };

    const saveRecord = async (initiative: InitiativeType) => {
        const updatedInitiative = structuredClone(initiative);
        updatedInitiative.data.records = [
            ...(updatedInitiative.data.records ?? []),
            newRecord
        ];
        await saveInitiative.mutateAsync(updatedInitiative);
        setNewRecord(getNewInitiativeRecord);
    };

    const deleteRecord = async (initiative: InitiativeType, recordToDelete: InitiativeRecordType) => {
        const updatedInitiative = structuredClone(initiative);
        updatedInitiative.data.records = updatedInitiative.data.records.filter(
            record => record.data.recordID !== recordToDelete.data.recordID
        );
        await saveInitiative.mutateAsync(updatedInitiative);
    };

    const updateRecordComment = (comment: string) => {
        setNewRecord(prev => ({
            ...prev,
            data: {
                ...prev.data,
                comment: comment,
            },
        }));
    };

    const updateRecordRating = (rating: number) => {
        setNewRecord(prev => ({
            ...prev,
            data: {
                ...prev.data,
                rating: rating,
            },
        }));
    }

    const emojiMap: Record<string, string> = {
        1: "🙁",
        2: "😐",
        3: "😊",
        4: "😄",
        5: "😍",
    }

    if (!initiatives) return <></>;

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Flex w={{base: "95%", md: "90%"}} direction="column" fontSize="md" mx="auto" gap="1.2rem"
                      position="relative" top="4.8rem"
                      paddingBottom="100px" minHeight="15rem">
                    {initiatives?.sort((a, b) => a.data.name.localeCompare(b.data.name))
                        .map((initiative, i) => (
                            <Flex key={i} position="relative" boxShadow="xs" p="0.5rem"
                                  borderRadius="md"
                                  flexDirection="column" w="100%" bg="primary.lighter/30"
                                  onClick={() => setSelectedInitiative(initiative)}
                            >
                                <Flex justifyContent="space-between" align="center">
                                    <Text fontWeight="bold">{initiative.data.name}</Text>
                                    <MyButton type='edit' onClick={e => openEdit(e, initiative)}/>
                                </Flex>
                                <Show when={selectedInitiative === initiative}>
                                    {initiative.data.records?.length > 0 && initiative.data.records.map((record, x) => (
                                        <Flex
                                            key={x}
                                            color="primary.contrast"
                                            position="relative"
                                            justifyContent="space-between"
                                            m="0.3rem"
                                            p='0.3rem'
                                            bg="primary.lighter"
                                            borderRadius="md"
                                        >
                                            {record.data.comment}
                                            {emojiMap[record.data.rating]}
                                            <MyButton type="delete" onClick={() => deleteRecord(initiative, record)}
                                                      extraSmall={true}/>
                                        </Flex>
                                    ))}

                                    <Flex>
                                        <Editable.Root
                                            value={newRecord.data.comment}
                                            onValueChange={(e) => updateRecordComment(e.value)}
                                            ml="0.3rem"
                                            flex="1"
                                        >
                                            <Editable.Preview
                                                w="100%"
                                                _hover={{bg: "primary.lighter"}}
                                            />
                                            <Editable.Textarea
                                                maxLength={120}
                                                w="100%"
                                                resize="none"
                                                _selection={{bg: "theme.Spruit2", color: "black"}}
                                            />
                                        </Editable.Root>
                                        <RatingGroup.Root
                                            count={5}
                                            value={newRecord.data.rating}
                                            onValueChange={(e) => updateRecordRating(e.value)}
                                            cursor="pointer"
                                        >
                                            <RatingGroup.Control>
                                                {Array.from({length: 5}).map((_, index) => (
                                                    <RatingGroup.Item
                                                        key={index}
                                                        index={index + 1}
                                                        minW="9"
                                                        filter="grayscale(1)"
                                                        transform="scale(1)"
                                                        _checked={{
                                                            filter: "grayscale(0)",
                                                            transform: "scale(1.1)",
                                                        }}
                                                        _focus={{
                                                            boxShadow: "none",
                                                            outline: "none",
                                                        }}
                                                        transition="all 0.06s ease"
                                                    >
                                                        {emojiMap[index + 1]}
                                                    </RatingGroup.Item>
                                                ))}
                                            </RatingGroup.Control>
                                        </RatingGroup.Root>
                                        <MyButton type="confirm"
                                                  disabled={!newRecord.data.comment || newRecord.data.rating === 6}
                                                  onClick={() => saveRecord(initiative)}/>
                                    </Flex>
                                </Show>
                            </Flex>
                        ))}
                </Flex>
            </Box>
        </Flex>
    );
};

export default InitiativesList;