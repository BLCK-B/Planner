import {Box, Flex, Image} from "@chakra-ui/react";
import {useTheme} from "next-themes";

const PlannerLogo = () => {

    const {theme} = useTheme();

    const logo = theme === "light" ? `/plannertextblack.svg` : "/plannertextwhite.svg";

    return (
        <Box>
            <Flex w="110px" p="5px" justifyContent="center" alignItems="center" opacity="0.9">
                <Image src={logo} height="100%"/>
            </Flex>
        </Box>
    );
};

export default PlannerLogo;
