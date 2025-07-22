import {MdTaskAlt} from "react-icons/md";
import {IconButton} from "@chakra-ui/react";

type Props = {
    onClick: () => void;
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