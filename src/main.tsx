import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Unregister any service workers from previous deployments (fixes workbox caching issues)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Unregistered service worker:', registration.scope);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
