import {
    Dialog,
    Portal,
    Flex,
    Input,
    Show,
    Field,
    useBreakpointValue,
    NumberInput, HStack, IconButton,
} from "@chakra-ui/react";
import {showInitiativeCreator, existingInitiativeForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import {useQueryClient} from "@tanstack/react-query";
import MyButton from "@/components/base/MyButton.tsx";
import DialogBackdrop from "@/components/base/DialogBackdrop.tsx";
import loadInitiativesQuery from "@/queries/LoadloadInitiativesQuery.tsx";
import useSaveInitiative from "@/queries/UseSaveInitiative.tsx";
import useDeleteInitiative from "@/queries/UseDeleteInitiative.tsx";
import {LuMinus, LuPlus} from "react-icons/lu";

const InitiativeCreator = () => {
    const isDesktop = useBreakpointValue(
        {base: false, md: true},
        {ssr: false}
    );

    const queryClient = useQueryClient();

    const [showDialog, setShowDialog] = useAtom(showInitiativeCreator);

    const [newInitiative, setNewInitiative] = useAtom(existingInitiativeForEdit);

    const saveInitiativeMutation = useSaveInitiative();

    const deleteInitiativeMutation = useDeleteInitiative();

    const updateInitiative = (key: keyof typeof newInitiative.data, value: string | number) => {
        setNewInitiative(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const saveInitiative = async () => {
        await saveInitiativeMutation.mutateAsync(newInitiative);
        setNewInitiative(newInitiative);
        setShowDialog({show: false, isNew: false});

        const queryKey = loadInitiativesQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    const deleteInitiative = async () => {
        await deleteInitiativeMutation.mutateAsync(newInitiative);
        setNewInitiative(newInitiative);
        setShowDialog({show: false, isNew: false});
    };

    const disableSaveRules = () => {
        return !newInitiative.data.name;
    };

    return (
        <Dialog.Root size={"sm"} open={showDialog.show} trapFocus={false}>
            <Portal>
                <DialogBackdrop/>
                <Dialog.Positioner style={isDesktop ? styles.dialogDesktop : styles.dialogMobile}>
                    <Dialog.Content bg="primary" color="primary.contrast" textStyle="body">
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                New initiative
                                <Show when={!showDialog.isNew}>
                                    <MyButton type="delete" onClick={deleteInitiative}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Field.Root invalid={!newInitiative.data.name}>
                                <Input p="2px" variant="subtle" value={newInitiative.data.name}
                                       placeholder="Name"
                                       onChange={(e) => updateInitiative("name", e.target.value)}
                                       bg="primary.lighter"/>
                            </Field.Root>
                            Require input every X days
                            <NumberInput.Root defaultValue="3" unstyled spinOnPress={false} min={0} max={30}
                                              onValueChange={(e) => updateInitiative("remindDays", e.valueAsNumber)}>
                                <HStack gap="2">
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuMinus/>
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch"/>
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" size="sm">
                                            <LuPlus/>
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                </HStack>
                            </NumberInput.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <MyButton type="confirm" onClick={saveInitiative} disabled={disableSaveRules()}/>
                            <MyButton type="cancel" onClick={() => setShowDialog({show: false, isNew: false})}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default InitiativeCreator;

const styles = {
    dialogMobile: {
        alignItems: "center",
        padding: "0"
    },
    dialogDesktop: {
        alignItems: "center",
        padding: "0.5rem"
    }
};