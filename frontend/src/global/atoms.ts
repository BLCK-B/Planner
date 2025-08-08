import {atom} from 'jotai';
import type {Task} from '@/types/Task.ts'
import {newTask} from "@/types/Task.ts";

export const showExactDatesAtom = atom(false);

export const showAddDialog = atom(false);

export const existingItemForEdit = atom<Task>(newTask);