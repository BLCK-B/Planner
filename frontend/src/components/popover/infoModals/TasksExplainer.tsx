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
        <Dialog.Root size="md" open={showDialog === 'tasksExplainer'} trapFocus={false}
                     scrollBehavior={isDesktop ? "outside" : "inside"}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Text fontWeight="bold"> How to: Tasks</Text>
                        </Dialog.Header>
                        <Dialog.Body p={isDesktop ? undefined : "0.6rem"}>
                            <Text>Tasks are your everyday to-do list ordered by date.</Text>
                            <Text>You can assign tags, create repeating tasks and mark importance.</Text>
                            <ModalImage src="/tasks-explainer/tasks.png"/>
                            <Text>Tasks past their date are shown in red. Tasks without a date are labeled
                                as &#34;Someday&#34;. Completed tasks are at the bottom of the list.</Text>
                            <ModalImage src="/tasks-explainer/othertasks.png"/>
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