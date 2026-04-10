import {
    Dialog,
    Portal,
    useBreakpointValue,
    Text,
} from "@chakra-ui/react";
import {useAtom} from "jotai";
import MyButton from "@/components/base/MyButton.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";
import {explainerModal} from "../../../global/atoms";
import ModalImage from "../../base/ModalImage";

const TasksExplainer = () => {
    const isDesktop = useBreakpointValue(
        {base: false, md: true},
        {ssr: false}
    );

    const [showDialog, setShowDialog] = useAtom(explainerModal);

    return (
        <Dialog.Root size="md" open={showDialog === 'worklistExplainer'} trapFocus={false}
                     scrollBehavior={isDesktop ? "outside" : "inside"}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Text fontWeight="bold"> How to: Worklist</Text>
                        </Dialog.Header>
                        <Dialog.Body p={isDesktop ? undefined : "0.6rem"}>
                            <Text>Here you can create lists for planning and tracking specific activities.</Text>
                            <ModalImage src="/worklist-explainer/worklist.png"/>
                            <Text>In a list, the items can be reordered and checked as completed. Your changes are saved
                                automatically.</Text>
                            <ModalImage src="/worklist-explainer/worklistDetail.png"/>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="cancel" onClick={() => setShowDialog('')}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default TasksExplainer;