import {IconButton} from "@chakra-ui/react";
import {IoMdAdd, IoMdCheckmark} from "react-icons/io";
import {RxCross2} from "react-icons/rx";
import {MdDelete} from "react-icons/md";
import {RxExit} from "react-icons/rx";
import {FaHashtag} from "react-icons/fa";
import * as React from "react";

type Props = {
    type: 'confirm' | 'add' | 'cancel' | 'delete' | 'exit' | 'tagedit'
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const MyButton = ({type, onClick, disabled = false}: Props) => {

    const backgroundColors: Record<string, string> = {
        delete: "theme.Reddish",
        exit: "grey",
        cancel: "grey",
        default: "theme.Spruit3",
    };

    const hoverColors: Record<string, string> = {
        delete: "theme.ReddishHover",
        exit: "lightgrey",
        cancel: "lightgrey",
        default: "theme.Spruit3Hover",
    };

    const bgColor = backgroundColors[type] || backgroundColors.default;

    const hoverColor = hoverColors[type] || hoverColors.default;

    return (
        <IconButton
            onClick={onClick}
            disabled={disabled}
            size="xs"
            aria-label={type}
            bg={bgColor}
            color="black"
            _hover={{bg: hoverColor}}
        >
            {type === "confirm" && <IoMdCheckmark/>}
            {type === "add" && <IoMdAdd/>}
            {type === "cancel" && <RxCross2/>}
            {type === "delete" && <MdDelete/>}
            {type === "exit" && <RxExit/>}
            {type === "tagedit" && <FaHashtag/>}
        </IconButton>
    );
};

export default MyButton;