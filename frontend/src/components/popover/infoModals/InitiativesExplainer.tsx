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

const InitiativesExplainer = () => {
    const isDesktop = useBreakpointValue(
        {base: false, md: true},
        {ssr: false}
    );

    const [showDialog, setShowDialog] = useAtom(explainerModal);

    return (
        <Dialog.Root size="md" open={showDialog === 'initiativesExplainer'} trapFocus={false}
                     scrollBehavior={isDesktop ? "outside" : "inside"}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Text fontWeight="bold"> How to: Initiatives</Text>
                        </Dialog.Header>
                        <Dialog.Body p={isDesktop ? undefined : "0.6rem"}>
                            <Text>Initiatives help you try new ideas, with reminders and self-feedback.</Text>
                            <ModalImage src="/initiatives-explainer/initiatives.png"/>
                            <Text>Write down what you want to try and set a reminder every few
                                days. Each time, you can select a rating and leave a note about what can be done
                                better.</Text>
                            <br/>
                            <Text>This page should help keep you motivated while forming habits and iterating on
                                ideas.</Text>
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

export default InitiativesExplainer;