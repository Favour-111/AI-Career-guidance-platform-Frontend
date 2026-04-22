import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toggleDarkMode } from "../../store/slices/themeSlice";
import { markNotificationRead } from "../../store/slices/authSlice";
import api from "../../services/api";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  Bookmark,
  ArrowRight,
} from "lucide-react";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
  "/recommendations": "Career Recommendations",
  "/market-trends": "Market Trends",
  "/learning": "Learning Paths",
  "/bookmarks": "My Bookmarks",
  "/admin": "Admin Panel",
};

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { recommendation } = useSelector((state) => state.recommendations);
  const bookmarkedIds = user?.bookmarkedCareers || [];
  const bookmarkedCareers = (recommendation?.careers || []).filter((c) =>
    bookmarkedIds.includes(c.careerId),
  );

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const notifRef = useRef(null);
  const bookmarkRef = useRef(null);

  const title = PAGE_TITLES[location.pathname] || "CareerAI";
  const unread = user?.notifications?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(e.target)) {
        setShowBookmarks(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id) => {
    dispatch(markNotificationRead(id));
    await api.patch(`/auth/notifications/${id}/read`).catch(() => {});
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-primary dark:text-white hidden sm:block">
            {title}
          </h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Bookmarks */}
          <div className="relative" ref={bookmarkRef}>
            <button
              onClick={() => {
                setShowBookmarks(!showBookmarks);
                setShowNotifs(false);
              }}
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              title="Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary dark:bg-secondary text-white text-[9px] font-bold flex items-center justify-center">
                  {bookmarkedIds.length > 9 ? "9+" : bookmarkedIds.length}
                </span>
              )}
            </button>

            {showBookmarks && (
              <div className="absolute right-0 mt-2 w-80 card p-0 shadow-card-hover overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between px-4 py-3 border-b dark:border-dark-border">
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">
                    Bookmarks
                  </span>
                  {bookmarkedIds.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary">
                      {bookmarkedIds.length} saved
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y dark:divide-dark-border">
                  {bookmarkedCareers.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bookmark className="w-8 h-8 text-gray-200 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {bookmarkedIds.length > 0
                          ? "Generate recommendations to see saved careers"
                          : "No bookmarks yet"}
                      </p>
                    </div>
                  ) : (
                    bookmarkedCareers.slice(0, 5).map((c) => (
                      <div
                        key={c.careerId}
                        onClick={() => {
                          navigate("/bookmarks");
                          setShowBookmarks(false);
                        }}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                              {c.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {c.category}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${
                              c.matchScore >= 70
                                ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                                : c.matchScore >= 45
                                  ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "text-red-500 bg-red-50 dark:bg-red-900/20"
                            }`}
                          >
                            {c.matchScore}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2.5 border-t dark:border-dark-border">
                  <button
                    onClick={() => {
                      navigate("/bookmarks");
                      setShowBookmarks(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-primary dark:text-secondary hover:underline"
                  >
                    View all bookmarks
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 card p-0 shadow-card-hover overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between px-4 py-3 border-b dark:border-dark-border">
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">
                    Notifications
                  </span>
                  {unread > 0 && (
                    <span className="badge-danger">{unread} new</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y dark:divide-dark-border">
                  {!user?.notifications || user.notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">
                      No notifications
                    </p>
                  ) : (
                    user.notifications.slice(0, 8).map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleMarkRead(n._id)}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-card transition-colors
                          ${!n.read ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                      >
                        <p
                          className={`${!n.read ? "font-semibold text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}
                        >
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
