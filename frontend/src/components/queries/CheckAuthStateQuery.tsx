import fetchRequest from "@/scripts/fetchRequest.tsx";

export const checkAuthStateQuery = () => {
    return ({
        queryKey: ['userItems'],
        queryFn: async () => {
            return await fetchRequest("GET", "/users/authCheck")
        },
        retry: false,
    });
};

export default checkAuthStateQuery;