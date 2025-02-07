import React, { Suspense, useEffect } from "react";
import { Navbar, FallbackUI } from "./components/index.js";
import { Outlet } from "react-router-dom";
import ErrorBoundaryWrapper from "./errorBoundary/ErrorBoundaryWrapper.jsx";
import useAuthStore from "./store/useAuthStore.js";
import useThemeStore from "./store/useThemeStore.js";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.getElementById("html").setAttribute("data-theme", theme);
  }, []);

  if (isCheckingAuth && !user) {
    return <FallbackUI />;
  }

  return (
    <ErrorBoundaryWrapper>
      <Suspense fallback={<FallbackUI />}>
        <Navbar />
        <Outlet />
      </Suspense>
      <Toaster />
    </ErrorBoundaryWrapper>
  );
}

export default App;
