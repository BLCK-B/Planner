import {MdDelete} from "react-icons/md";
import {Box, IconButton} from "@chakra-ui/react";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const ButtonDelete = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} size="sm" variant="subtle">
            <MdDelete aria-label="Delete"/>
        </IconButton>
    );
};
export default ButtonDelete;