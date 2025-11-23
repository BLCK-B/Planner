import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useSetAtom} from "jotai";
import {existingItemForEdit, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {getNewTask} from "@/types/Task.ts";

const ActionButtonsMainPage = () => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const setShowAddDialog = useSetAtom(showAddDialog);

    const setEditItem = useSetAtom(existingItemForEdit);

    const createNewItem = () => {
        setEditItem(getNewTask());
        setShowAddDialog(true);
    };

    const activeIconColor = (active: boolean) => {
        return active ? "theme.Spruit2" : "primary.lighter";
    };

    return (
        <Flex justify="center" justifyContent="space-evenly" p="5px">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} size="xs"
                        bg={activeIconColor(showExactDates)}>
                <IoCalendarNumber color="black" aria-label="Complete"/>
            </IconButton>
            <MyButton type="add" onClick={createNewItem}/>
        </Flex>
    );
};

export default ActionButtonsMainPage;