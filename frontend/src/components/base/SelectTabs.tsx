import {Tabs} from "@chakra-ui/react";
import {MdOutlineChecklist} from "react-icons/md";
import {FaRegCheckCircle} from "react-icons/fa";
import {useQuery} from "@tanstack/react-query";
import type {TaskType} from "@/types/TaskType.ts";
import {loadUncompletedItemsQuery} from "@/queries/LoadItemsQueries.tsx";
import {isDatePast} from "@/functions/Dates.tsx";

type Props = {
    tabs: string[];
    selected: string;
    valueChanged: (selectedTab: string) => void;
    orientation?: "horizontal" | "vertical";
    responsive?: boolean;
};

const SelectTabs = ({tabs, selected, valueChanged, orientation = "horizontal", responsive = false}: Props) => {

    const {data: uncompletedTasks} = useQuery<TaskType[]>(loadUncompletedItemsQuery());

    const getIcon = (tabName: string) => {
        switch (tabName) {
            case "Tasks":
                return <FaRegCheckCircle/>;
            case "Worklist":
                return <MdOutlineChecklist/>;
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

    return (
        <Tabs.Root variant="subtle" orientation={orientation} value={selected}
                   onValueChange={(e) => valueChanged(e.value)}>
            <Tabs.List p="0.5" w="100%" flexDirection={responsive ? {base: "row", sm: "row", md: "column"} : undefined}
                       gap={1} overflowX="scroll">
                {tabs.map((tab, index) => (
                    <Tabs.Trigger key={index} value={tab} mb="1"
                                  color="primary.contrast/40"
                                  flexShrink={0}
                                  _selected={{
                                      bg: "primary.lighter/65",
                                      color: "primary.contrast",
                                  }}
                                  {...(tab === "Tasks" && isTasksPending() && styles.highlight)}
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
    highlight: {
        textDecoration: "underline",
        textDecorationColor: "primary.contrast",
        textDecorationThickness: "2px",
        textUnderlineOffset: "2px",
    },
};