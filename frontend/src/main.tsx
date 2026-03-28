import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ChakraProvider, createSystem, defaultConfig} from "@chakra-ui/react";
import {QueryClientProvider} from '@tanstack/react-query';
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen'
import {queryClient} from "@/QueryClient.tsx";
import {styles} from "@/globalStyles.ts";
import {ThemeProvider} from 'next-themes';

const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const system = createSystem(defaultConfig, styles);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system">
                <ChakraProvider value={system}>
                    <RouterProvider router={router}/>
                </ChakraProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);
