import {Button, Flex, Heading, Spacer, Show} from "@chakra-ui/react";
import {useNavigate, useLocation} from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import ListFilters from "@/components/header/ListFilters.tsx";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogInClick = () => {
        navigate("/auth/log-in");
    };

    const handleSignUpClick = () => {
        navigate("/auth/register");
    };

    return (
        <Flex p="2">
            <Heading>Planner</Heading>
            <Heading>🦥</Heading>
            <Show when={location.pathname === "/main"}>
                <ListFilters/>
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
