import FetchRequest from "@/scripts/FetchRequest.tsx";

export const checkAuthStateQuery = () => {
    return ({
        queryKey: ['userItems'],
        queryFn: async () => {
            return await FetchRequest("GET", "/users/authCheck")
        },
        retry: false,
    });
};

export default checkAuthStateQuery;