import {QueryClient, QueryCache, MutationCache} from '@tanstack/react-query';
import type {FetchError} from '@/types/FetchError.ts';

const OAUTH_URL = (import.meta.env.VITE_API_URL as string | undefined) ? "https://planner-api.spruits.eu/oauth2/authorization/zitadel" : "http://localhost:8081/oauth2/authorization/zitadel";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
    queryCache: new QueryCache({
        onError: (error: unknown) => {
            const err = error as FetchError;
            if (err.status === 401) {
                window.location.href = OAUTH_URL;
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: unknown) => {
            const err = error as FetchError;
            if (err.status === 401) {
                window.location.href = OAUTH_URL;
            }
        },
    }),
});