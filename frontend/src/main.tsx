import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ChakraProvider, createSystem, defaultConfig, defineConfig, defineTextStyles} from "@chakra-ui/react";
import {QueryClientProvider} from '@tanstack/react-query';
import {RouterProvider} from '@tanstack/react-router'
import {router} from '@/routes/__root';
import {queryClient} from "@/QueryClient.tsx";
import "@fontsource/roboto";

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const textStyles = defineTextStyles({
    body: {
        value: {
            fontFamily: "Roboto, sans-serif",
            fontWeight: "500",
            // fontSize: "20px",
        },
    },
})

const config = defineConfig({
    theme: {
        textStyles,
        tokens: {
            colors: {
                base: {
                    100: "#FFFFFF",
                    200: "#ebebeb",
                    300: "#d0d0d0",
                    400: "#b0b0b0",
                    500: "#989898",
                    600: "#7D7D7D",
                },
                theme: {
                    "RichBlack": "#071E22",
                    "RichPurple": "#050517",
                    "Skobeloff": "#1D7874",
                    "Viridian": "#679289",
                    "Peach": "#F4C095",
                    "Sunset": "#EFC88B",
                    "Flame": "#CF5C36",
                    "Red": "#EE2E31",
                    "MossGreen": "#c7e4b5",
                    "EeerieBlack": "#222725",
                    "Night": "#121113",
                    "LightGreen": "#b1d09e",
                    "Reddish": "#f87171",
                    "ReddishLight": "#f9dbdb",
                },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={system}>
                <RouterProvider router={router}/>
            </ChakraProvider>
        </QueryClientProvider>
    </StrictMode>
);
