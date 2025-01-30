import PropTypes from "prop-types";
import { MdTaskAlt } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";

const ButtonComplete = ({ onClick, disabled = false }) => {
  return (
    <IconButton onClick={onClick} disabled={disabled} bg="none" h="2em" w="2em">
      <MdTaskAlt color="green" alt="Complete" />
    </IconButton>
  );
};
export default ButtonComplete;

ButtonComplete.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
