import { Tabs } from "@chakra-ui/react";

const Menu = () => {
  return (
    <Tabs.Root defaultValue="tasks" orientation="vertical" variant="subtle">
      <Tabs.List bg="base.300" p="1" display="flex" flexDirection={{ base: "row", sm: "row", md: "column" }} w="100%">
        <Tabs.Trigger value="tasks" mb="2">
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="notes" mb="2">
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="todos">Tab 3</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default Menu;
