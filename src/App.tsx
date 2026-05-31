import { AppProviders } from "@/config/providers/AppProviders";
import { AppRouter } from "@/config/routes/router";

export default function App() {
    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    );
}
