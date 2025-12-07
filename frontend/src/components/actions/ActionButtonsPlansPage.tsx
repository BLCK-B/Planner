import {IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import MyButton from "@/components/base/MyButton.tsx";
import {useAtom, useSetAtom} from "jotai";
import {
    existingPlanForEdit,
    showExactDatesAtom,
    showPlanCreator
} from "@/global/atoms.ts";
import {getNewPlan} from "@/types/PlanType.ts";
import BaseActionButtons from "@/components/actions/BaseActionButtons.tsx";

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

    const actionButtons = (
        <>
            <MyButton type="add" onClick={createNewPlan}/>
            <IconButton onClick={() => setShowExactDates(!showExactDates)} size="xs"
                        bg={activeIconColor(showExactDates)}>
                <IoCalendarNumber color="black" aria-label="Complete"/>
            </IconButton>
        </>
    );

    return (
        <BaseActionButtons buttons={actionButtons}/>
    );
};

export default ActionButtonsPlansPage;