import {Button} from "@chakra-ui/react";
import {useRouter} from '@tanstack/react-router';
import {postAuthRoute} from "@/routes/__root.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";

const HeaderLandingPage = () => {
    const router = useRouter();

    const login = () => {
        router.navigate({
            to: postAuthRoute.fullPath,
            params: {formType: 'log-in'},
        });
    };

    const signup = () => {
        router.navigate({
            to: postAuthRoute.fullPath,
            params: {formType: 'register'},
        });
    };

    const rightContent = (
        <>
            <Button bg="green" onClick={signup} mr={2}>
                Sign up
            </Button>
            <Button bg="green" onClick={login}>
                Log In
            </Button>
        </>
    );

    return (
        <BaseHeader leftSide={<></>} rightSide={rightContent}/>
    );
};
export default HeaderLandingPage;