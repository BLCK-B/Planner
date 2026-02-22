import {QueryClient, QueryCache, MutationCache} from '@tanstack/react-query';
import type {FetchError} from '@/types/FetchError.ts';

// todo: server - redirect to backend endpoint or just auth
const URL = (import.meta.env.VITE_API_URL as string | undefined) ? "http://localhost:8081/oauth2/authorization/zitadel" : "https://auth.spruits.eu";

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
                window.location.href = URL;
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: unknown) => {
            const err = error as FetchError;
            if (err.status === 401) {
                window.location.href = URL;
            }
        },
    }),
});