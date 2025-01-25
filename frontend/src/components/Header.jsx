import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/auth"); // Navigate to /auth when button is clicked
  };

  return (
    <Flex p="2">
      <Heading>Planner</Heading>
      <Heading>🦥</Heading>
      <Spacer />

      {/* Conditionally render the Sign up button only on the landing page */}
      {location.pathname === "/" && (
        <Button bg="green" onClick={handleClick}>
          Sign up
        </Button>
      )}
    </Flex>
  );
};
export default Header;
