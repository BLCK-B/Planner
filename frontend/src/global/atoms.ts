import {atom} from 'jotai';
import {getNewTask, type Task} from "@/types/Task.ts";
import {getNewPlan, type Plan} from "@/types/Plan.ts";
import {getNewTag, type TagType} from "@/types/TagType.ts";

export const activePage = atom("Tasks");

export const showExactDatesAtom = atom(false);

// todo: one global show creator based on smth like url param
// todo: {...} immutable new item local copies with getNew methods
export const showAddDialog = atom(false);

export const existingItemForEdit = atom<Task>(getNewTask());


export const showPlanCreator = atom(false);

export const existingPlanForEdit = atom<Plan>(getNewPlan());


export const showTagCreator = atom(false);

export const existingTagForEdit = atom<TagType>(getNewTag());