import {MdTaskAlt} from "react-icons/md";
import {IconButton} from "@chakra-ui/react";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const ButtonComplete = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} bg="none" h="2em" w="2em">
            <MdTaskAlt color="green" aria-label="Complete"/>
        </IconButton>
    );
};
export default ButtonComplete;