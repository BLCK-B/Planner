import {Flex, SimpleGrid, useBreakpointValue} from "@chakra-ui/react";
import type {ReactNode} from "react";

type Props = {
    buttons?: ReactNode;
}

const BaseActionButtons = ({buttons}: Props) => {

    const isLargeScreen = useBreakpointValue({base: false, md: true}) as boolean;

    if (!buttons) {
        return <></>;
    }
    
    if (isLargeScreen) {
        return (
            <SimpleGrid
                columns={2}
                justifyItems="center"
                p="5px"
                rowGap={3}
                columnGap={1.5}
                margin="0 1rem 0 1rem"
            >
                {buttons}
            </SimpleGrid>
        );
    } else {
        return (
            <Flex gap={2}>
                {buttons}
            </Flex>
        );
    }
};

export default BaseActionButtons;