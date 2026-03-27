import {Tabs} from "@chakra-ui/react";
import {MdOutlineChecklist} from "react-icons/md";
import {FaRegCheckCircle} from "react-icons/fa";
import {MdRestartAlt} from "react-icons/md";
import {useQuery} from "@tanstack/react-query";
import loadInitiativesQuery from "@/queries/LoadloadInitiativesQuery.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {loadUncompletedItemsQuery} from "@/queries/LoadItemsQueries.tsx";
import {isDatePast} from "@/functions/Dates.tsx";
import type {InitiativeType} from "@/types/InitiativeType.ts";

type Props = {
    tabs: string[];
    selected: string;
    valueChanged: (selectedTab: string) => void;
    orientation?: "horizontal" | "vertical";
    responsive?: boolean;
};

const SelectTabs = ({tabs, selected, valueChanged, orientation = "horizontal", responsive = false}: Props) => {

    const {data: uncompletedTasks} = useQuery<TaskType[]>(loadUncompletedItemsQuery());

    const {data: initiatives} = useQuery(loadInitiativesQuery());

    const getIcon = (tabName: string) => {
        switch (tabName) {
            case "Tasks":
                return <FaRegCheckCircle/>;
            case "Worklist":
                return <MdOutlineChecklist/>;
            case "Initiatives":
                return <MdRestartAlt/>;
            default:
                return;
        }
    };

    const isTasksPending = () => {
        if (!uncompletedTasks) return false;

        return uncompletedTasks
            .filter((task) => !task.data.completed)
            .filter((task) => isDatePast(task.data.date)).length > 0;
    };

    // todo test, extract to one function
    const isInitiativesPending = (): boolean => {
        if (!initiatives) return false;

        const pendingInitiatives: InitiativeType[] = [];

        for (const initiative of initiatives) {
            if (!initiative.data.records.length) continue;
            const lastRecordDate = new Date(Math.max(
                ...initiative.data.records.map(r => new Date(r.data.date).getTime())
            ));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastDate = new Date(lastRecordDate);
            lastDate.setHours(0, 0, 0, 0);
            lastDate.setDate(lastDate.getDate() + initiative.data.remindDays);
            if (today >= lastRecordDate) {
                pendingInitiatives.push(initiative);
            }
        }
        return pendingInitiatives.length > 0
    };

    return (
        <Tabs.Root variant="subtle" orientation={orientation} value={selected}
                   onValueChange={(e) => valueChanged(e.value)}>
            <Tabs.List p="0.5" w="100%" flexDirection={responsive ? {base: "row", sm: "row", md: "column"} : undefined}
                       gap={1}>
                {tabs.map((tab, index) => (
                    <Tabs.Trigger key={index} value={tab} mb="1"
                                  color="primary.contrast/40"
                                  _selected={{
                                      bg: "primary.lighter/65",
                                      color: "primary.contrast",
                                  }}
                                  {...(tab === "Tasks" && isTasksPending() && styles.highlightRed)}
                                  {...(tab === "Initiatives" && isInitiativesPending() && styles.highlightYellow)}
                    >
                        {getIcon(tab)}
                        {tab}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
};

export default SelectTabs;

const styles = {
    highlightYellow: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "theme.BrightYellow",
    },
    highlightRed: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "theme.Reddish",
    },
};