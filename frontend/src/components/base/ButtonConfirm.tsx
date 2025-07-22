import {FaRegCheckSquare} from "react-icons/fa";
import {IconButton} from "@chakra-ui/react";

type Props = {
    onClick: () => void;
    disabled?: boolean;
}

const ButtonConfirm = ({onClick, disabled = false}: Props) => {
    return (
        <IconButton onClick={onClick} disabled={disabled} bg="base.200" h="1.5em" w="1.5em">
            <FaRegCheckSquare color="green" aria-label="Confirm"/>
        </IconButton>
    );
};
export default ButtonConfirm;