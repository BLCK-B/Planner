import {atom} from 'jotai';
import {newTask, type Task} from "@/types/Task.ts";
import {newPlan, type Plan} from "@/types/Plan.ts";
import {newTag, type TagType} from "@/types/TagType.ts";

export const activePage = atom("Tasks");

export const showExactDatesAtom = atom(false);

// todo: one global show creator based on smth like url param
// todo: {...} immutable new item local copies with getNew methods
export const showAddDialog = atom(false);

export const existingItemForEdit = atom<Task>(newTask);


export const showPlanCreator = atom(false);

export const existingPlanForEdit = atom<Plan>(newPlan);


export const showTagCreator = atom(false);

export const existingTagForEdit = atom<TagType>(newTag);