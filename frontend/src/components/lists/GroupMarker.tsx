import {Flex, Text} from "@chakra-ui/react";

type Props = {
    text: string;
    adjacent: boolean;
};

const GroupMarker = ({text, adjacent}: Props) => {
    if (adjacent) {
        return (
            <Flex
                direction="column"
                justify="center"
                position="absolute"
                ml="-120px"
                top="50%"
                transform="translateY(-50%)"
                h="100%"
                borderRadius="0px"
                w="80px"
                align="center"
            >
                <Text color="primary.contrast/40" whiteSpace="nowrap">
                    {text}
                </Text>
            </Flex>
        );
    } else {
        return (
            <Flex h="100%" alignContent="center">
                <Text color="primary.contrast/50" whiteSpace="nowrap" fontWeight="bold">
                    {text}
                </Text>
            </Flex>
        );
    }
}

export default GroupMarker;