import {Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {useNavigate, useLocation} from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";

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
            <Spacer/>
            {location.pathname === "/main" && <FaUserCircle style={{width: "2em", height: "2em", color: "grey"}}/>}
            {/* Conditionally render the Sign-up button only on the landing page */}
            {location.pathname === "/" && (
                <Flex gap="10px">
                    <Button bg="green" onClick={handleSignUpClick}>
                        Sign up
                    </Button>
                    <Button bg="green" onClick={handleLogInClick}>
                        Log In
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};
export default Header;
