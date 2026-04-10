import MyButton from "@/components/base/MyButton.tsx";
import {useSetAtom} from "jotai";
import {
    existingInitiativeForEdit,
    showInitiativeCreator,
} from "@/global/atoms.ts";
import {Box, useBreakpointValue} from "@chakra-ui/react";
import {getNewInitiative} from "@/types/InitiativeType.ts";

const ActionButtonsInitiativesPage = () => {

    const isDesktop = useBreakpointValue({base: false, md: true}) as boolean;

    const setShowAddDialog = useSetAtom(showInitiativeCreator);

    const setEditItem = useSetAtom(existingInitiativeForEdit);

    const createNewItem = () => {
        setEditItem(getNewInitiative());
        setShowAddDialog({show: true, isNew: true});
    };

    return (
        <Box m={isDesktop ? "0.6rem" : "0 0 0.3rem 0"}>
            <MyButton type="add" onClick={createNewItem}/>
        </Box>
    );
};

export default ActionButtonsInitiativesPage;