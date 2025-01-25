import { useState } from "react";
import { Box, Button, Input, HStack, GridItem, Grid, VStack, Flex, Heading, Icon, Spacer } from "@chakra-ui/react";
import Header from "../components/Header";

function Landing() {
  return (
    <Box w="100vw" h="100vh" bg="white">
      <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" gap={2} h="100%">
        {/* header */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc">
          <Header />
        </GridItem>

        <GridItem colSpan={1} bg="#dcdcdc"></GridItem>

        {/* deadline tasks */}
        <GridItem colSpan={4} bg="#dcdcdc"></GridItem>

        {/* long term tasks */}
        <GridItem colSpan={2} bg="#dcdcdc"></GridItem>

        {/* controls */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc"></GridItem>
      </Grid>
    </Box>
  );
}

export default Landing;
