import type {TaskType} from "@/types/TaskType.ts";
import type {TagType} from "@/types/TagType.ts";

export type PlanType = {
    tag: TagType;
    tasks: TaskType[];
};