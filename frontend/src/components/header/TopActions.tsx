import {Button, Flex, Heading, Spacer, Show, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import {useAtom, useSetAtom} from 'jotai';
import {existingItemForEdit, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {newTask} from "@/types/Task.ts";

const TopActions = () => {

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
        <Flex style={styles.filters} justify="center">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} bg="none">
                <IoCalendarNumber color={activeColor(showExactDates)} aria-label="Complete"/>
            </IconButton>
            <Button size="xs" onClick={createNewItem}>Add</Button>
        </Flex>
    );

};

export default TopActions;

const styles = {
    filters: {
        height: "3em",
        // backgroundColor: "white",
    },
};