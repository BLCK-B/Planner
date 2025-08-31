import {Button, Flex, Spacer, Show, Image} from "@chakra-ui/react";
import {useRouter, useLocation} from '@tanstack/react-router';
import {FaUserCircle} from "react-icons/fa";
import TopActions from "@/components/header/TopActions.tsx";

const Header = () => {
    const router = useRouter();
    const location = useLocation();

    const handleLogInClick = () => {
        router.navigate({
            to: '/auth/$formType',
            params: {formType: 'log-in'},
        });
    };

    const handleSignUpClick = () => {
        router.navigate({
            to: '/auth/$formType',
            params: {formType: 'register'},
        });
    };

    return (
        <Flex p="2" align="center">
            <Image src="/plannertext.png" height="20px"/>
            <Show when={location.pathname === "/main"}>
                <TopActions/>
                <Spacer/>
                <FaUserCircle style={{width: "2em", height: "2em", color: "grey"}}/>
            </Show>
            <Show when={location.pathname === "/"}>
                <Spacer/>
                <Flex gap="10px">
                    <Button bg="green" onClick={handleSignUpClick}>
                        Sign up
                    </Button>
                    <Button bg="green" onClick={handleLogInClick}>
                        Log In
                    </Button>
                </Flex>
            </Show>
        </Flex>
    );
};
export default Header;
