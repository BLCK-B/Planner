import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useSetAtom} from "jotai";
import {existingItemForEdit, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {newTask} from "@/types/Task.ts";

const ActionButtonsMainPage = () => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const setShowAddDialog = useSetAtom(showAddDialog);

    const setEditItem = useSetAtom(existingItemForEdit);

    const createNewItem = () => {
        setEditItem(newTask);
        setShowAddDialog(true);
    };

    const activeColor = (active: boolean) => {
        return active ? "black" : "grey";
    };

    return (
        <Flex justify="center" w="80%" ml="20px" justifyContent="flex-start" gap="1em">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} bg="none">
                <IoCalendarNumber color={activeColor(showExactDates)} aria-label="Complete"/>
            </IconButton>
            <MyButton type="add" onClick={createNewItem}/>
        </Flex>
    );
};

export default ActionButtonsMainPage;