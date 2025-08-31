import {IconButton} from "@chakra-ui/react";
import {IoMdCheckmark} from "react-icons/io";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const ButtonConfirm = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} size="xs">
            <IoMdCheckmark aria-label="Confirm"/>
        </IconButton>
    );
};
export default ButtonConfirm;