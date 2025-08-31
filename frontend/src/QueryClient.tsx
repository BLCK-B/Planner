import {QueryClient, QueryCache, MutationCache} from '@tanstack/react-query';
import {authRoute, router} from '@/routes/__root.tsx';
import type {FetchError} from '@/types/FetchError.ts';

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
                router.navigate({
                    to: authRoute.fullPath,
                    params: {formType: 'log-in'},
                });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: unknown) => {
            const err = error as FetchError;
            if (err.status === 401) {
                router.navigate({
                    to: authRoute.fullPath,
                    params: {formType: 'log-in'},
                });
            }
        },
    }),
});