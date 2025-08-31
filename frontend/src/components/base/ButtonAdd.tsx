import {IconButton} from "@chakra-ui/react";
import {IoMdAdd} from "react-icons/io";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const ButtonAdd = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} size="xs">
            <IoMdAdd aria-label="Confirm"/>
        </IconButton>
    );
};
export default ButtonAdd;