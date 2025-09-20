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
                // primary: {
                //     "contrast": "#000000",
                //     "lighter": "#FFFFFF",
                //     "base": "#ebebeb",
                //     "darker": "#d0d0d0",
                // },
                primary: {
                    "contrast": "#FFFFFF",
                    "lighter": "#454545",
                    "base": "#262626",
                    "darker": "#1a1a1a",
                },
                // theme: {
                //     "Peach": "#F4C095",
                //     "Flame": "#CF5C36",
                //     "Red": "#EE2E31",
                //     "MossGreen": "#c7e4b5",
                //     "LightGreen": "#b1d09e",
                //     "Reddish": "#f87171",
                //     "ReddishLight": "#f9dbdb",
                // },
                theme: {
                    "Peach": "#F4C095",
                    "Flame": "#CF5C36",
                    "Red": "#EE2E31",
                    "Success": "#505c48",
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
