import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main.jsx";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import { TaskProvider } from "./TaskContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskProvider>
      <ChakraProvider>
        <Router>
          <Routes>
            {/* landing page */}
            <Route path="/" element={<Landing />} />
            {/* auth */}
            <Route path="/auth" element={<Auth />} />
            {/* main view */}
            <Route path="/main" element={<Main />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </TaskProvider>
  </StrictMode>
);
