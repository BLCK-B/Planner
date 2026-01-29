import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ChakraProvider, createSystem, defaultConfig} from "@chakra-ui/react";
import {QueryClientProvider} from '@tanstack/react-query';
import {RouterProvider} from '@tanstack/react-router'
import {router} from '@/routes/__root';
import {queryClient} from "@/QueryClient.tsx";
import {styles} from "@/globalStyles.ts";
import {ColorModeProvider} from "@/components/ui/color-mode.tsx";

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const system = createSystem(defaultConfig, styles);

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            {/* todo: https://chakra-ui.com/docs/get-started/migration */}
            {/* todo  ColorModeProvider and useColorMode have been removed in favor of next-themes */}
            <ChakraProvider value={system}>
                <ColorModeProvider>
                    <RouterProvider router={router}/>
                </ColorModeProvider>
            </ChakraProvider>
        </QueryClientProvider>
    </StrictMode>
);
