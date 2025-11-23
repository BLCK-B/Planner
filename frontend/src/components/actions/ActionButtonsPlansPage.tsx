import {Flex, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useSetAtom} from "jotai";
import {
    existingPlanForEdit,
    showExactDatesAtom,
    showPlanCreator
} from "@/global/atoms.ts";
import {getNewPlan} from "@/types/PlanType.ts";

const ActionButtonsPlansPage = () => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const setShowAddDialog = useSetAtom(showPlanCreator);

    const setEditPlan = useSetAtom(existingPlanForEdit);

    const createNewPlan = () => {
        setEditPlan(getNewPlan());
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
            <MyButton type="add" onClick={createNewPlan}/>
        </Flex>
    );
};

export default ActionButtonsPlansPage;