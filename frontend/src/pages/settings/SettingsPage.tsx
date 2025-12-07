import {Box, Card, Flex, RadioGroup, VStack} from "@chakra-ui/react";
import ErrorModal from "@/components/popover/ErrorModal.tsx";
import HeaderSettingsPage from "@/components/header/HeaderSettingsPage.tsx";

const SettingsPage = () => {

    const items = [
        {label: "Automatic", value: "1"},
        {label: "Dark mode", value: "2"},
        {label: "Light mode", value: "3"},
    ]

    return (
        <Box w="100vw" h="100vh" bg="primary.darker" fontSize="17px" textStyle="body">
            <HeaderSettingsPage/>

            <Flex p="5px">
                <Card.Root variant="elevated" bg="primary.lighter" w="100%" color="primary.contrast">
                    <Card.Body>
                        <RadioGroup.Root defaultValue="1">
                            <VStack gap="6">
                                {items.map((item) => (
                                    <RadioGroup.Item key={item.value} value={item.value}>
                                        <RadioGroup.ItemHiddenInput/>
                                        <RadioGroup.ItemIndicator/>
                                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                ))}
                            </VStack>
                        </RadioGroup.Root>
                    </Card.Body>
                </Card.Root>
            </Flex>

            <ErrorModal/>
        </Box>
    );
};

export default SettingsPage;