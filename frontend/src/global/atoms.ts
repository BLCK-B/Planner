import {atom} from 'jotai';
import {getNewTask, type TaskType} from "@/types/TaskType.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";
import {getNewWorkItem, type WorkItemType} from "@/types/WorkItemType.ts";
import type {Filter} from "@/types/Filter.ts";

// user-controlled
export const showExactDatesAtom = atom(false);

export const filterContentAtom = atom<Filter>({
    tagIds: [],
    important: false
});

// system
export const errorModalContent = atom<string>('');

export const isDemoMode = atom(false);


export const showAddDialog = atom(false);

export const existingItemForEdit = atom<TaskType>(getNewTask());


export const showTagCreator = atom(false);

export const existingTagForEdit = atom<TagType>(getNewTag());


export const showWorkItemCreator = atom(false);

export const existingWorkItemForEdit = atom<WorkItemType>(getNewWorkItem());