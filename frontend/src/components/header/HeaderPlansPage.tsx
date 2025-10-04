import BaseHeader from "@/components/header/BaseHeader.tsx";
import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import ButtonAdd from "@/components/base/ButtonAdd.tsx";
import {useAtom, useSetAtom} from "jotai";
import {existingPlanForEdit, showPlanCreator, showExactDatesAtom} from "@/global/atoms.ts";
import {newPlan} from "@/types/Plan.ts";

const HeaderPlansPage = () => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const setShowAddDialog = useSetAtom(showPlanCreator);

    const setEditPlan = useSetAtom(existingPlanForEdit);

    const createNewPlan = () => {
        setEditPlan(newPlan);
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
            <ButtonAdd onClick={createNewPlan}/>
        </Flex>
    );

    return (
        <BaseHeader leftSide={leftContent} menu={true}/>
    );
};
export default HeaderPlansPage;

const styles = {
    filters: {},
};