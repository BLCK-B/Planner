import {Dialog, Portal, Flex,} from "@chakra-ui/react";
import {errorModalContent} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import MyButton from "@/components/base/MyButton.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";

const ErrorModal = () => {

    const [errorMessage, setErrorMessage] = useAtom(errorModalContent);

    return (
        <Dialog.Root size={"md"} open={!!errorMessage} trapFocus={false}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body" userSelect="text">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                Error
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            {errorMessage}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="cancel" onClick={() => setErrorMessage('')}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ErrorModal;