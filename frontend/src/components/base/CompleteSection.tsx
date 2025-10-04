import {Flex, IconButton, Show, Box} from "@chakra-ui/react";
import {IoMdCheckmark} from "react-icons/io";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    isCompleted: boolean;
    disabled?: boolean;
}

const CompleteSection = ({onClick, isCompleted, disabled = false}: Props) => {
    return (
        <Flex bg={isCompleted ? "theme.Spruit2" : "primary.lighterer"}
              _hover={{bg: "theme.Spruit1", _active: {bg: "theme.Spruit2",},}} w="2.5rem"
              borderRadius="0px 5px 5px 0px"
              alignItems="center">
            <IconButton onClick={onClick} disabled={disabled} bg="none" h="2em" w="2em">
                <IoMdCheckmark color="#141414" aria-label="Complete"/>
            </IconButton>
        </Flex>
    );
};
export default CompleteSection;