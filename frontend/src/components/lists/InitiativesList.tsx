import {Box, Editable, Flex, RatingGroup, Show, Spacer, Text} from "@chakra-ui/react";
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
import {useEffect, useState} from "react";
import useSaveInitiative from "@/queries/UseSaveInitiative.tsx";
import {getNewInitiativeRecord, type InitiativeRecordType} from "@/types/InitiativeRecordType.ts";
import {MdEventRepeat} from "react-icons/md";
import {dateToReadableDDMMYY, getTodaysDate} from "@/functions/Dates.tsx";
import {getPendingInitiatives} from "@/functions/Reusable.ts";

const InitiativesList = () => {

    const setShowAddDialog = useSetAtom(showInitiativeCreator);

    const setEditItem = useSetAtom(existingInitiativeForEdit);

    const {data: initiatives} = useQuery(loadInitiativesQuery());

    const saveInitiative = useSaveInitiative();

    const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);

    const [pendingInitiativeIds, setPendingInitiativeIds] = useState<string[]>([]);

    const [newRecord, setNewRecord] = useState<InitiativeRecordType>(getNewInitiativeRecord);

    const openEdit = (e: React.MouseEvent<HTMLButtonElement>, item: InitiativeType) => {
        e.stopPropagation();
        setEditItem(item);
        setShowAddDialog({show: true, isNew: false});
    };

    const saveRecord = async (initiative: InitiativeType) => {
        const updatedRecord = {
            ...newRecord,
            data: {
                ...newRecord.data,
                date: getTodaysDate(),
            },
        };
        const updatedInitiative = structuredClone(initiative);
        updatedInitiative.data.records = [
            ...(updatedInitiative.data.records ?? []),
            updatedRecord
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

    useEffect(() => {
        const pending = getPendingInitiatives(initiatives);
        setPendingInitiativeIds(pending.map(i => i.itemID));
    }, [initiatives]);

    if (!initiatives) return <></>;

    return (
        <Flex direction="column" height="100%" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Flex w={{base: "95%", md: "90%"}} direction="column" fontSize="md" mx="auto" gap="1.2rem"
                      position="relative" top="4.8rem"
                      paddingBottom="100px" minHeight="15rem"
                >
                    {initiatives?.sort((a, b) => a.data.name.localeCompare(b.data.name))
                        .map((initiative, i) => (
                            <Flex key={i} position="relative" boxShadow="xs" p="0.5rem" borderRadius="md"
                                  flexDirection="column" w="100%" bg="primary.lighter/30" cursor="pointer"
                                  onClick={() => setSelectedInitiativeId(initiative.itemID)}
                                  {...(pendingInitiativeIds.some(id => initiative.itemID === id) && styles.pending)}
                            >
                                <Flex align="center" gap="1.2rem">
                                    <Show when={initiative.data.remindDays > 0}>
                                        <Flex gap="0.3rem" align="center">
                                            <MdEventRepeat color="primary.contrast" aria-label="Complete"/>
                                            <Text>{initiative.data.remindDays} d</Text>
                                        </Flex>
                                    </Show>
                                    <Text fontWeight="bold">{initiative.data.name}</Text>
                                    <Spacer/>
                                    <Box marginRight="0.3rem">
                                        <MyButton type='edit' onClick={e => openEdit(e, initiative)} extraSmall={true}/>
                                    </Box>
                                </Flex>
                                <Show when={selectedInitiativeId === initiative.itemID}>
                                    <Flex bg="primary.lighter" borderRadius="md"
                                          m="0.6rem 0 0 0" p="0 0.3rem 0 0" align="center" wrap="wrap"
                                          justifyContent="flex-end"
                                    >
                                        <Editable.Root
                                            value={newRecord.data.comment}
                                            onValueChange={(e) => updateRecordComment(e.value)}
                                            ml="0.3rem"
                                            flex="1"
                                            minWidth="calc(min(20rem, 60%))"
                                        >
                                            <Editable.Preview
                                                w="100%"
                                                _hover={{bg: "primary.lighter"}}
                                                maxHeight="1.2rem"
                                            />
                                            <Editable.Input
                                                maxLength={100}
                                                w="100%"
                                                _selection={{bg: "theme.Spruit2", color: "black"}}
                                            />
                                        </Editable.Root>
                                        <Box display="flex" alignItems="center">
                                            <RatingGroup.Root
                                                count={5}
                                                value={newRecord.data.rating}
                                                onValueChange={(e) => updateRecordRating(e.value)}
                                                cursor="pointer"
                                                mr="0.6rem"
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
                                                      disabled={!newRecord.data.comment}
                                                      onClick={() => saveRecord(initiative)} extraSmall={true}/>
                                        </Box>
                                    </Flex>
                                    {initiative.data.records?.length > 0 && initiative.data.records
                                        .slice()
                                        .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
                                        .map((record, x) => (
                                            <Flex
                                                key={x}
                                                color="primary.contrast"
                                                position="relative"
                                                justifyContent="space-between"
                                                mt='0.6rem'
                                                gap="0.6rem"
                                                borderRadius="md"
                                            >
                                                <Text>{dateToReadableDDMMYY(record.data.date)}</Text>
                                                <Show when={record.data.rating !== 6}>
                                                    <Text>{emojiMap[record.data.rating]}</Text>
                                                </Show>
                                                <Text flex="5">{record.data.comment}</Text>
                                                <Spacer/>
                                                <Box marginRight="0.3rem">
                                                    <MyButton type="delete"
                                                              onClick={() => deleteRecord(initiative, record)}
                                                              extraSmall={true}/>
                                                </Box>
                                            </Flex>
                                        ))}
                                </Show>
                            </Flex>
                        ))}
                </Flex>
            </Box>
        </Flex>
    );
};

export default InitiativesList;

const styles = {
    pending: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "theme.BrightYellow",
    },
};