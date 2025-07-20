import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import Landing from "./pages/Landing.tsx";
import Auth from "./pages/Auth.tsx";
import { TaskProvider } from "./TaskContext.tsx";

const system = createSystem(defaultConfig, {
  theme: {
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
      },
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <TaskProvider>
      <ChakraProvider value={system}>
        <Router>
          <Routes>
            {/* landing page */}
            <Route path="/" element={<Landing />} />
            {/* auth */}
            <Route path="/auth/:formType" element={<Auth />} />
            {/* main page */}
            <Route path="/main" element={<MainPage />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </TaskProvider>
  </StrictMode>
);
