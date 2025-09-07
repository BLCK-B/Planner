import {Box, Flex, Text} from "@chakra-ui/react";

type Props = {
    text: string;
    adjacent: boolean;
    color?: string;
};

const GroupMarker = ({text, adjacent, color = "primary.darker"}: Props) => {
    if (adjacent) {
        return (
            <Flex
                direction="column"
                justify="center"
                position="absolute"
                ml="-120px"
                top="50%"
                transform="translateY(-50%)"
                height="100%"
                borderRadius="0px"
                w="80px"
                align="center"
            >
                <Text color="gray.500" whiteSpace="nowrap">
                    {text}
                </Text>
            </Flex>
        );
    } else {
        return (
            <Box
                height="100%"
                bg={color}
            >
                <Text color="gray.500" whiteSpace="nowrap">
                    {text}
                </Text>
            </Box>
        );
    }
}

export default GroupMarker;