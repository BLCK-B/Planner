import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex p="2">
      <Heading>Planner</Heading>
      <Heading>🦥</Heading>
      <Spacer></Spacer>
      <Button bg="green">Sign up</Button>
    </Flex>
  );
};
export default Header;
