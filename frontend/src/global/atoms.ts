import {atom} from 'jotai';
import {getNewTask, type TaskType} from "@/types/TaskType.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";
import {getNewWorkItem, type WorkItemType} from "@/types/WorkItemType.ts";
import type {Filter} from "@/types/Filter.ts";
import {getNewInitiative, type InitiativeType} from "@/types/InitiativeType.ts";
import {atomWithStorage} from 'jotai/utils'

export type showCreatorType = {
    show: boolean;
    isNew: boolean;
};

// user-controlled
export const showExactDatesAtom = atomWithStorage<boolean>('showExactDates', false);

export const filterContentAtom = atom<Filter>({
    tagIds: [],
    important: false
});

// system
export const errorModalContent = atom<string>('');


export const showAddDialog = atom<showCreatorType>({show: false, isNew: false,});

export const existingItemForEdit = atom<TaskType>(getNewTask());


export const showTagCreator = atom<showCreatorType>({show: false, isNew: false,});

export const existingTagForEdit = atom<TagType>(getNewTag());


export const showWorkItemCreator = atom<showCreatorType>({show: false, isNew: false,});

export const existingWorkItemForEdit = atom<WorkItemType>(getNewWorkItem());


export const showInitiativeCreator = atom<showCreatorType>({show: false, isNew: false,});

export const existingInitiativeForEdit = atom<InitiativeType>(getNewInitiative());