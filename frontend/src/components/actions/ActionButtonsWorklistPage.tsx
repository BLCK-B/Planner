import {Box, IconButton, Popover, useBreakpointValue} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {
    existingWorkItemForEdit,
    filterContentAtom,
    showExactDatesAtom,
    showWorkItemCreator
} from "@/global/atoms.ts";
import {MdFilterAlt} from "react-icons/md";
import FilterSelects from "@/components/sidemenu/FilterSelects.tsx";
import {getNewWorkItem} from "@/types/WorkItemType.ts";

const ActionButtonsWorklistPage = () => {

    const isDesktop = useBreakpointValue({base: false, md: true}) as boolean;

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const [filterContent] = useAtomValue(filterContentAtom);

    const setShowAddDialog = useSetAtom(showWorkItemCreator);

    const setEditItem = useSetAtom(existingWorkItemForEdit);

    const createNewItem = () => {
        setEditItem(getNewWorkItem());
        setShowAddDialog(true);
    };

    const activeDateIconColor = (active: boolean) => {
        return active ? "theme.Spruit2" : "primary.lighter";
    };

    const activeFilterColor = () => {
        return filterContent ? "theme.Spruit2" : "primary.lighter";
    };

    const popoverPlacement = useBreakpointValue({base: "top-start", md: "right-start"}) ?? "top-start";

    return (
        <Box
            display="grid"
            gridTemplateColumns={isDesktop ? "auto auto" : "auto auto auto auto"}
            gap="0.6rem"
            m={isDesktop ? "0.6rem" : "0 0 0.3rem 0"}
        >
            <IconButton
                onClick={() => setShowExactDates(!showExactDates)}
                size="xs"
                bg={activeDateIconColor(showExactDates)}
            >
                <IoCalendarNumber color="black" aria-label="Complete"/>
            </IconButton>
            <MyButton type="add" onClick={createNewItem}/>
            <Popover.Root positioning={{placement: popoverPlacement}}>
                <Popover.Trigger asChild>
                    <IconButton size="xs" bg={activeFilterColor()}>
                        <MdFilterAlt color="black"/>
                    </IconButton>
                </Popover.Trigger>
                <FilterSelects/>
            </Popover.Root>
        </Box>
    );
};

export default ActionButtonsWorklistPage;