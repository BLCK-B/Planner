import {Flex, Spacer, Show} from "@chakra-ui/react";
import {IoMenu} from "react-icons/io5";
import type {ReactNode} from "react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import {useBreakpointValue} from "@chakra-ui/react";

type Props = {
    leftSide?: ReactNode;
    rightSide?: ReactNode;
    menu?: boolean;
};

const BaseHeader = ({leftSide = <></>, rightSide = <></>, menu = false}: Props) => {
    const isLargeScreen = useBreakpointValue({base: false, md: true}) as boolean;

    return (
        <Flex p="2" align="center" h="2.5rem" position={isLargeScreen ? "absolute" : "relative"} right="0">
            <Show when={!isLargeScreen}>
                <PlannerLogo/>
                {leftSide}
            </Show>
            <Spacer/>
            <Flex gap="10px">
                {rightSide}
            </Flex>
            <Show when={menu}>
                <IoMenu style={{width: "2em", height: "2em", color: "grey"}}/>
            </Show>
        </Flex>
    );
};
export default BaseHeader;
