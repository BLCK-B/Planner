export type Tabs = 'Tasks' | 'Plans' | 'Worklist';

export const getTabs: Tabs[] = ['Tasks', 'Plans', 'Worklist'] as const;

export const mapPathToName = (path: string): Tabs => {
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/plans')) return 'Plans';
    if (path.includes('/worklist')) return 'Worklist';
    return 'Tasks'; // default tab
}