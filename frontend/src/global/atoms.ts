import {atom} from 'jotai';
import {getNewTask, type TaskType} from "@/types/TaskType.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";
import {getNewWorkItem, type WorkItemType} from "@/types/WorkItemType.ts";
import type {Filter} from "@/types/Filter.ts";

export type showCreatorType = {
    show: boolean;
    isNew: boolean;
};

// user-controlled
export const showExactDatesAtom = atom(false);

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