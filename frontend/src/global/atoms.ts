import {atom} from 'jotai';
import {getNewTask, type TaskType} from "@/types/TaskType.ts";
import {getNewPlan, type PlanType} from "@/types/PlanType.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";

// user controlled
export const activePage = atom("Tasks");

export const showExactDatesAtom = atom(false);

export const filterContentAtom = atom<string[]>([]);

// system
export const errorModalContent = atom<string>('');


export const showAddDialog = atom(false);

export const existingItemForEdit = atom<TaskType>(getNewTask());


export const showPlanCreator = atom(false);

export const existingPlanForEdit = atom<PlanType>(getNewPlan());


export const showTagCreator = atom(false);

export const existingTagForEdit = atom<TagType>(getNewTag());

export const isDemoMode = atom(false);