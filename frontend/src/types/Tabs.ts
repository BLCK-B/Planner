export type Tabs = 'Tasks' | 'Plans' | 'Worklist' | 'Initiatives';

export const getTabs: Tabs[] = ['Tasks', 'Worklist', 'Initiatives'] as const;

export const mapPathToName = (path: string): Tabs => {
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/worklist')) return 'Worklist';
    if (path.includes('/initiatives')) return 'Initiatives';
    return 'Tasks'; // default tab
}