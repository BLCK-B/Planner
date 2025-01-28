import PropTypes from "prop-types";
import { FaRegCheckSquare } from "react-icons/fa";
import { Button } from "@chakra-ui/react";

const ButtonConfirm = ({ onClick, disabled = false }) => {
  return (
    <Button onClick={onClick} disabled={disabled} bg="base.200" h="1.5em" w="1.5em">
      <FaRegCheckSquare color="green" alt="Confirm" />
    </Button>
  );
};
export default ButtonConfirm;

ButtonConfirm.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
