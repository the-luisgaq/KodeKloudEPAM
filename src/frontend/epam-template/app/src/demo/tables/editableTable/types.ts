import { DropPosition } from '@epam/uui-core';

export type TaskType = 'story' | 'task';

export interface Task {
    id: number;
    type: TaskType;
    parentId?: number;
    name: string;
    estimate?: number;
    assignee?: number;
    startDate?: string;
    exactStartDate?: string;
    dueDate?: string;
    status?: string;
    description?: string;
    order?: string;
    isDeleted?: boolean;
}

export interface Resource {
    id: number;
    name: string;
    fullName: string;
}

export interface Status {
    id: string;
    name: string;
    priority: number;
    color?: string;
}

export type InsertTaskCallback = (position: DropPosition, relativeTask?: Task | null, existingTask?: Task | null) => void;
export type DeleteTaskCallback = (task: Task) => void;

export interface ColumnsProps {
    insertTask: InsertTaskCallback;
    deleteTask: DeleteTaskCallback;
}
