import BaseHeader from "@/components/header/BaseHeader.tsx";
import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import ButtonAdd from "@/components/base/ButtonAdd.tsx";
import {useAtom, useSetAtom} from "jotai";
import {existingItemForEdit, showAddDialog, showExactDatesAtom} from "@/global/atoms.ts";
import {newTask} from "@/types/Task.ts";

const HeaderMainPage = () => {

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

    const leftContent = (
        <Flex style={styles.filters} justify="center" w="80%" ml="20px" justifyContent="flex-start" gap="1em">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} bg="none">
                <IoCalendarNumber color={activeColor(showExactDates)} aria-label="Complete"/>
            </IconButton>
            <ButtonAdd onClick={createNewItem}/>
        </Flex>
    );

    return (
        <BaseHeader leftSide={leftContent} menu={true}/>
    );
};
export default HeaderMainPage;

const styles = {
    filters: {},
};