import {atom} from 'jotai';
import {getNewTask, type TaskType} from "@/types/TaskType.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";
import {getNewWorkItem, type WorkItemType} from "@/types/WorkItemType.ts";
import type {Tabs} from "@/types/Tabs.ts";

// user-controlled
export const activePage = atom<Tabs>("Tasks");

export const showExactDatesAtom = atom(false);

export const filterContentAtom = atom<string[]>([]);

// system
export const errorModalContent = atom<string>('');

export const isDemoMode = atom(false);


export const showAddDialog = atom(false);

export const existingItemForEdit = atom<TaskType>(getNewTask());


export const showTagCreator = atom(false);

export const existingTagForEdit = atom<TagType>(getNewTag());


export const showWorkItemCreator = atom(false);

export const existingWorkItemForEdit = atom<WorkItemType>(getNewWorkItem());