import {Flex, Image} from "@chakra-ui/react";

const PlannerLogo = () => {
    return (
        <Flex w="110px" p="5px" justifyContent="center" alignItems="center">
            <Image src="/plannertext.png" height="100%"/>
        </Flex>
    );
};

export default PlannerLogo;
