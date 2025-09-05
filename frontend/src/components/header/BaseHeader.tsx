import {Flex, Spacer, Image, Show} from "@chakra-ui/react";
import {IoMenu} from "react-icons/io5";
import type {ReactNode} from "react";

type Props = {
    leftSide?: ReactNode;
    rightSide?: ReactNode;
    menu?: boolean;
};

const BaseHeader = ({leftSide = <></>, rightSide = <></>, menu = false}: Props) => {
    return (
        <Flex p="2" align="center" h="2.5rem">
            <Image src="/plannertext.png" height="20px"/>
            {leftSide}
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
