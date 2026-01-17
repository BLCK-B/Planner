import {Box, useBreakpointValue} from "@chakra-ui/react";
import MyButton from "@/components/base/MyButton.tsx";
import {useSetAtom} from "jotai";
import {existingWorkItemForEdit, showWorkItemCreator} from "@/global/atoms.ts";
import {getNewWorkItem} from "@/types/WorkItemType.ts";

const ActionButtonsWorklistPage = () => {

    const isDesktop = useBreakpointValue({base: false, md: true}) as boolean;

    const setShowAddDialog = useSetAtom(showWorkItemCreator);

    const setEditItem = useSetAtom(existingWorkItemForEdit);

    const createNewItem = () => {
        setEditItem(getNewWorkItem());
        setShowAddDialog(true);
    };

    return (
        <Box
            display="grid"
            gridTemplateColumns={isDesktop ? "auto auto" : "auto auto auto auto"}
            gap="0.6rem"
            m={isDesktop ? "0.6rem" : "0 0 0.3rem 0"}
        >
            <MyButton type="add" onClick={createNewItem}/>
        </Box>
    );
};

export default ActionButtonsWorklistPage;