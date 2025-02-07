import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path=""
        element={
          <AuthLayout requiresAuth={true}>
            <HomePage />
          </AuthLayout>
        }
      />
      <Route
        path="login"
        element={
          <AuthLayout requiresAuth={false}>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="signup"
        element={
          <AuthLayout requiresAuth={false}>
            <SignupPage />
          </AuthLayout>
        }
      />
      <Route path="settings" element={<SettingsPage />} />
      <Route
        path="profile"
        element={
          <AuthLayout requiresAuth={true}>
            <ProfilePage />
          </AuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
