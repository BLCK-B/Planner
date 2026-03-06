import {Flex, Spacer, Show} from "@chakra-ui/react";
import {IoMenu} from "react-icons/io5";
import type {ReactNode} from "react";
import PlannerLogo from "@/components/base/PlannerLogo.tsx";
import {useBreakpointValue} from "@chakra-ui/react";
import {mainRoute, router, settingsRoute} from "@/routes/__root.tsx";

type Props = {
    leftSide?: ReactNode;
    rightSide?: ReactNode;
};

const goToSettingsPage = () => {
    router.navigate({to: settingsRoute.fullPath});
};

const goFromSettingsPage = () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        router.navigate({to: mainRoute.fullPath});
    }
};

const isSettingsOpened = () => {
    return router.state.location.href === "/app/settings";
}

const BaseHeader = ({leftSide = <></>, rightSide = <></>}: Props) => {
    const isDesktop = useBreakpointValue(
        {base: false, md: true},
        {ssr: false}
    );

    return (
        <Flex p="2" align="center" h="2.5rem" position={isDesktop ? "absolute" : "relative"} right="0">
            <Show when={!isDesktop}>
                <PlannerLogo/>
                {leftSide}
            </Show>
            <Spacer/>
            <Flex gap="10px">
                {rightSide}
            </Flex>
            <IoMenu style={{width: "2rem", height: "2rem", color: "grey"}} cursor="pointer"
                    onClick={isSettingsOpened() ? goFromSettingsPage : goToSettingsPage}/>
        </Flex>
    );
};
export default BaseHeader;
