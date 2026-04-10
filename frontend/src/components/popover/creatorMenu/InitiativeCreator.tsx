import {
    Dialog,
    Portal,
    Input,
    Show,
    Field,
    useBreakpointValue,
    NumberInput, HStack, IconButton, Text, Spacer,
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
    const isDesktop = useBreakpointValue({base: false, sm: true, md: true}, {ssr: false}) as boolean;

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
                        <Dialog.Body mt="1.2rem" p={isDesktop ? undefined : "0.3rem"}>
                            <Field.Root invalid={!newInitiative.data.name}>
                                <Input p="2px" variant="subtle" value={newInitiative.data.name}
                                       placeholder="Initiative name"
                                       onChange={(e) => updateInitiative("name", e.target.value)}
                                       bg="primary.lighter"/>
                            </Field.Root>
                            <NumberInput.Root defaultValue={String(newInitiative.data.remindDays)} unstyled
                                              spinOnPress={false}
                                              min={0} max={30}
                                              onValueChange={(e) => updateInitiative("remindDays", e.valueAsNumber)}
                                              opacity={newInitiative.data.remindDays === 0 ? 0.65 : 1}
                                              marginTop="1.2rem">
                                <HStack gap="0">
                                    <Text marginRight="0.6rem">
                                        Remind every
                                    </Text>
                                    <NumberInput.DecrementTrigger asChild>
                                        <IconButton variant="outline" bg="primary.lighter" size="2xs">
                                            <LuMinus/>
                                        </IconButton>
                                    </NumberInput.DecrementTrigger>
                                    <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch"/>
                                    <NumberInput.IncrementTrigger asChild>
                                        <IconButton variant="outline" bg="primary.lighter" size="2xs">
                                            <LuPlus/>
                                        </IconButton>
                                    </NumberInput.IncrementTrigger>
                                    <Text marginLeft="0.6rem">
                                        days
                                    </Text>
                                </HStack>
                            </NumberInput.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Show when={!showDialog.isNew}>
                                <MyButton type="delete" onClick={deleteInitiative}/>
                                <Spacer/>
                            </Show>
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