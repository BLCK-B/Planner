import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ChakraProvider, createSystem, defaultConfig, defineConfig, defineTextStyles} from "@chakra-ui/react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MainPage from "./pages/main/MainPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Auth from "./pages/Auth.tsx";
import {QueryClient} from '@tanstack/react-query';
import {QueryClientProvider} from '@tanstack/react-query';
import "@fontsource/roboto";
import PlansPage from "@/pages/main/PlansPage.tsx";

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

const queryClient = new QueryClient();

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={system}>
                <Router>
                    <Routes>
                        {/* landing page */}
                        <Route path="/" element={<LandingPage/>}/>
                        {/* auth */}
                        <Route path="/auth/:formType" element={<Auth/>}/>
                        {/* main page */}
                        <Route path="/main" element={<MainPage/>}/>
                        {/* plans page */}
                        <Route path="/plans" element={<PlansPage/>}/>
                    </Routes>
                </Router>
            </ChakraProvider>
        </QueryClientProvider>
    </StrictMode>
);
