import {atom} from 'jotai';
import type {Task} from '@/types/Task.ts'

export const showExactDatesAtom = atom(false);

export const showAddDialog = atom(false);

export const showEditDialog = atom<Task>(undefined);