import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { refreshAccessToken, getMe } from "./utils/api";
import { setAccessToken } from "./utils/auth";

if (import.meta.env.DEV) {
  (window as typeof window & {
    __authDebug?: {
      refreshAccessToken: typeof refreshAccessToken;
      setAccessToken: typeof setAccessToken;
      getMe: typeof getMe;
    };
  }).__authDebug = {
    refreshAccessToken,
    setAccessToken,
    getMe,
  };
}

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="850942692265-f86586526862.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
