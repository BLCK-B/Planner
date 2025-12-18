import {Flex, Image} from "@chakra-ui/react";
import {useColorModeValue} from "@/components/ui/color-mode";

const PlannerLogo = () => {

    const logo = useColorModeValue("/plannertextblack.svg", "/plannertextwhite.svg");

    return (
        <Flex w="110px" p="5px" justifyContent="center" alignItems="center">
            <Image src={logo} height="100%"/>
        </Flex>
    );
};

export default PlannerLogo;
