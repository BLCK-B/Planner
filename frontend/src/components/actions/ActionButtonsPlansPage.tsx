import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useSetAtom} from "jotai";
import {
    existingPlanForEdit,
    showExactDatesAtom,
    showPlanCreator
} from "@/global/atoms.ts";
import {newPlan} from "@/types/Plan.ts";

const ActionButtonsPlansPage = () => {

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

    return (
        <Flex justify="center" w="80%" ml="20px" justifyContent="flex-start" gap="1em">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} bg="none">
                <IoCalendarNumber color={activeColor(showExactDates)} aria-label="Complete"/>
            </IconButton>
            <MyButton type="add" onClick={createNewPlan}/>
        </Flex>
    );
};

export default ActionButtonsPlansPage;