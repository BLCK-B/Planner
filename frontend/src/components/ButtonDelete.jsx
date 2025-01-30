import PropTypes from "prop-types";
import { FaTrashAlt } from "react-icons/fa";
import { IconButton } from "@chakra-ui/react";

const ButtonDelete = ({ onClick, disabled = false }) => {
  return (
    <IconButton onClick={onClick} disabled={disabled} bg="base.200" h="1.5em" w="1.5em">
      <FaTrashAlt color="black" alt="Delete" />
    </IconButton>
  );
};
export default ButtonDelete;

ButtonDelete.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
