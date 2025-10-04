import {atom} from 'jotai';
import {newTask, type Task} from "@/types/Task.ts";
import {newPlan, type Plan} from "@/types/Plan.ts";

export const activePage = atom("Tasks");

export const showExactDatesAtom = atom(false);

export const showAddDialog = atom(false);

export const existingItemForEdit = atom<Task>(newTask);

export const showPlanCreator = atom(false);

export const existingPlanForEdit = atom<Plan>(newPlan);