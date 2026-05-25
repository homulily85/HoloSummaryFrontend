// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import Login from "./components/Login.tsx";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                    path='/oauth2/redirect'
                    element={<OAuth2RedirectHandler />}
                />
                <Route path='/*' element={<App />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
