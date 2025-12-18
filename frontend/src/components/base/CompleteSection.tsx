import {Box, Flex, IconButton, Show} from "@chakra-ui/react";
import {IoMdCheckmark} from "react-icons/io";
import * as React from "react";
import {MdEventRepeat} from "react-icons/md";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    isCompleted: boolean;
    disabled?: boolean;
    taskPlanColor?: string;
    isRepeat: boolean;
}

const CompleteSection = ({
                             onClick,
                             isCompleted,
                             disabled = false,
                             taskPlanColor = 'primary',
                             isRepeat = true
                         }: Props) => {
    return (
        <Flex bg={isCompleted ? "theme.Spruit2" : "primary.lighterer"}
              _hover={{bg: "theme.Spruit1", _active: {bg: "theme.Spruit2",},}} w="2.5rem"
              borderRadius="0px 5px 5px 0px"
              alignItems="center"
              borderRight={`1px solid ${taskPlanColor}`}
        >
            <Box>
                <IconButton onClick={onClick} disabled={disabled} bg="none" h="2em" w="2em">
                    <Show when={!isRepeat}>
                        <IoMdCheckmark color="#141414" aria-label="Complete"/>
                    </Show>
                    <Show when={isRepeat}>
                        <MdEventRepeat color="#141414" aria-label="Complete"/>
                    </Show>
                </IconButton>
            </Box>
        </Flex>
    );
};
export default CompleteSection;