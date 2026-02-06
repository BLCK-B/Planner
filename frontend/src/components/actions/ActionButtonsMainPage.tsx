import {Box, IconButton, Popover, useBreakpointValue} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {existingItemForEdit, filterContentAtom, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {getNewTask} from "@/types/TaskType.ts";
import {MdFilterAlt} from "react-icons/md";
import FilterSelects from "@/components/sidemenu/FilterSelects.tsx";

const ActionButtonsMainPage = ({isDesktop}: { isDesktop: boolean }) => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const [filterContent] = useAtomValue(filterContentAtom);

    const setShowAddDialog = useSetAtom(showAddDialog);

    const setEditItem = useSetAtom(existingItemForEdit);

    const createNewItem = () => {
        setEditItem(getNewTask());
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
            gap={isDesktop ? "0.6rem" : "0"}
            m={isDesktop ? "0.6rem" : "0 0 0.3rem 0"}
        >
            <IconButton
                onClick={() => setShowExactDates(!showExactDates)}
                size="xs"
                bg={activeDateIconColor(showExactDates)}
            >
                <IoCalendarNumber color="black" aria-label="Complete"/>
            </IconButton>
            {/* centering fix */}
            <Box m={isDesktop ? "0" : "0 0.6rem 0 0.6rem"}>
                <MyButton type="add" onClick={createNewItem}/>
            </Box>
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

export default ActionButtonsMainPage;