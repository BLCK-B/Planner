import {Grid} from "@chakra-ui/react";
import {checkAuthStateQuery} from "@/queries/CheckAuthStateQuery.tsx";
import {useQuery} from "@tanstack/react-query";
import type {Task as TaskType} from "@/types/Task.ts";
import {useEffect} from "react";
import type {FetchError} from "@/types/FetchError.ts";
import {useNavigate} from "react-router-dom";
import Plan from '@/components/items/Plan.tsx'

const PlansGrid = () => {
    const navigate = useNavigate();

    const {error} = useQuery<TaskType[]>(checkAuthStateQuery());

    useEffect(() => {
        if (error) {
            const fetchError = error as FetchError
            if (fetchError.status === 401) {
                navigate("/auth/log-in");
            } else {
                console.error(fetchError);
            }
        }
    }, [error]);

    return (
        <Grid templateColumns={{
            base: "repeat(1, 1fr)", // 1 column
            sm: "repeat(1, 1fr)", // 1 column
            md: "repeat(2, 1fr)", // 2 columns
        }} gap="6" p="25px" style={{overflowY: "scroll", scrollbarWidth: "none"}} height="100%">
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
        </Grid>
    );
};

export default PlansGrid;