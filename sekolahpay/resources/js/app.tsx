import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./Components/ThemeProvider";

const appName = import.meta.env.VITE_APP_NAME || "SEKOLAHPAY";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        // Prevent double mounting in development with React StrictMode
        if (el.hasOwnProperty('_root')) {
            el._root.render(
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            );
            return;
        }
        const root = createRoot(el);
        el._root = root;
        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: "#64748b",
    },
});
