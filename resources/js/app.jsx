import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "../css/app.css";
import { echo } from "./echo";

// Make Echo globally available
window.Echo = echo;

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob("./pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        // Set user ID for real-time notifications
        if (props.initialPage.props.auth?.user?.id) {
            window.userId = props.initialPage.props.auth.user.id;
        }

        createRoot(el).render(<App {...props} />);
    },
});
