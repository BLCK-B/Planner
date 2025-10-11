import {IconButton} from "@chakra-ui/react";
import {IoMdAdd, IoMdCheckmark} from "react-icons/io";
import {RxCross2} from "react-icons/rx";
import {MdDelete} from "react-icons/md";
import * as React from "react";

type Props = {
    type: 'confirm' | 'add' | 'cancel' | 'delete';
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const MyButton = ({type, onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} size="xs" aria-label={type}>
            {type === "confirm" && <IoMdCheckmark/>}
            {type === "add" && <IoMdAdd/>}
            {type === "cancel" && <RxCross2/>}
            {type === "delete" && <MdDelete/>}
        </IconButton>
    );
};

export default MyButton;