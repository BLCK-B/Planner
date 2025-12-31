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
                p="0.3rem"
                rowGap="0.6rem"
                columnGap="0.6rem"
                margin="0 0.6rem 0 0.6rem"
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