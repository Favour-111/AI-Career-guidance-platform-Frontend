import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/slices/authSlice";
import { setDarkMode } from "./store/slices/themeSlice";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import MarketTrendsPage from "./pages/MarketTrendsPage";
import LearningPage from "./pages/LearningPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminPanel from "./pages/AdminPanel";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/common/Spinner";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  const dispatch = useDispatch();
  const { initializing } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply saved dark mode on mount
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(fetchMe());
    } else {
      // Not logged in — skip initialization
      dispatch({ type: "auth/me/rejected" });
    }
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Loading CareerAI…
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/market-trends" element={<MarketTrendsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Route>

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPanel />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
