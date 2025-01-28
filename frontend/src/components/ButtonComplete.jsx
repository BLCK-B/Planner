import PropTypes from "prop-types";
import { MdTaskAlt } from "react-icons/md";
import { Button } from "@chakra-ui/react";

const ButtonComplete = ({ onClick, disabled = false }) => {
  return (
    <Button onClick={onClick} disabled={disabled} bg="none" h="2em" w="2em">
      <MdTaskAlt color="green" alt="Complete" />
    </Button>
  );
};
export default ButtonComplete;

ButtonComplete.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
