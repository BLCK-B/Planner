import { Button, Flex, Heading, Stack, Tabs, useTabs } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const Menu = () => {
  return (
    <Tabs.Root defaultValue="tasks" orientation="vertical" variant="subtle">
      <Tabs.List bg="base.300" rounded="l3" p="1" display="flex" flexDirection="column" w="100%">
        <Tabs.Trigger value="tasks" mb="2">
          Tasks
        </Tabs.Trigger>
        <Tabs.Trigger value="notes" mb="2">
          Notes
        </Tabs.Trigger>
        <Tabs.Trigger value="todos">Todo lists</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default Menu;
