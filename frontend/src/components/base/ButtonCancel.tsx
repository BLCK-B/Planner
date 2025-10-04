import {IconButton} from "@chakra-ui/react";
import {RxCross2} from "react-icons/rx";
import * as React from "react";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
    disabled?: boolean;
}

const ButtonCancel = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} size="xs" variant="outline" bg="primary.contrast">
            <RxCross2 aria-label="Cancel"/>
        </IconButton>
    );
};
export default ButtonCancel;