import {IconButton, Popover, SimpleGrid} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {existingItemForEdit, filterContentAtom, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {getNewTask} from "@/types/Task.ts";
import {MdFilterAlt} from "react-icons/md";
import FilterSelects from "@/components/sidemenu/FilterSelects.tsx";

const ActionButtonsMainPage = () => {

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

    return (
        <SimpleGrid
            columns={2}
            justifyItems="center"
            p="5px"
            rowGap={3}
            marginLeft="0.5rem"
            marginRight="0.5rem"
        >
            <IconButton
                onClick={() => setShowExactDates(!showExactDates)}
                size="xs"
                bg={activeDateIconColor(showExactDates)}
            >
                <IoCalendarNumber color="black" aria-label="Complete"/>
            </IconButton>
            <MyButton type="add" onClick={createNewItem}/>
            <Popover.Root positioning={{placement: "right-start"}}>
                <Popover.Trigger asChild>
                    <IconButton size="xs" bg={activeFilterColor()}>
                        <MdFilterAlt color="black"/>
                    </IconButton>
                </Popover.Trigger>
                <FilterSelects/>
            </Popover.Root>
        </SimpleGrid>
    );
};

export default ActionButtonsMainPage;