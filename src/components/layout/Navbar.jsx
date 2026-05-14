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
  X,
} from "lucide-react";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
  "/recommendations": "Career Recommendations",
  "/market-trends": "Market Trends",
  "/learning": "Learning Paths",
  "/bookmarks": "My Bookmarks",
  "/jobs": "Job Listings",
  "/settings": "Settings",
  "/help-support": "Help & Support",
  "/admin": "Admin Panel",
};

const QUICK_NAV = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Profile", path: "/profile" },
  { label: "Career Recommendations", path: "/recommendations" },
  { label: "Nigeria Market Trends", path: "/market-trends" },
  { label: "Learning Paths", path: "/learning" },
  { label: "Job Listings", path: "/jobs" },
  { label: "My Bookmarks", path: "/bookmarks" },
  { label: "Settings", path: "/settings" },
  { label: "Help & Support", path: "/help-support" },
];

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { recommendation } = useSelector((state) => state.recommendations);
  const bookmarkedIds = user?.bookmarkedCareers || [];
  const bookmarkedCareers = (recommendation?.careers || []).filter((c) =>
    bookmarkedIds.includes(c.careerId)
  );

  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef(null);
  const bookmarkRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const title = PAGE_TITLES[location.pathname] || "Career Guidiance";
  const unread = user?.notifications?.filter((n) => !n.read).length || 0;

  const searchResults = searchQuery.trim()
    ? QUICK_NAV.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (bookmarkRef.current && !bookmarkRef.current.contains(e.target)) setShowBookmarks(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchQuery("");
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setMobileSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") { setShowSearch(false); setMobileSearchOpen(false); setSearchQuery(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleMarkRead = async (id) => {
    dispatch(markNotificationRead(id));
    await api.patch(`/auth/notifications/${id}/read`).catch(() => {});
  };

  return (
    <header className="sticky top-0 z-20 border-b" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "#e8eef5" }}>
      <div className="flex items-center h-[60px] px-4 md:px-6 gap-3">

        {/* ── LEFT: hamburger + title ── */}
        <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
          <button onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: "#0F2854" }}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-[15px] font-bold truncate hidden sm:block" style={{ color: "#0F2854" }}>
            {title}
          </h1>
        </div>

        {/* ── CENTER: search bar (hidden on mobile) ── */}
        <div className="hidden sm:flex flex-1 justify-center px-4" ref={searchRef}>
          <div className="relative w-full max-w-[480px]">
            <div className={`flex items-center gap-2.5 rounded-2xl px-4 h-10 transition-all duration-200 cursor-text ${
              showSearch ? "shadow-lg ring-2 ring-blue-200" : "hover:bg-gray-100"
            }`}
              style={{
                background: showSearch ? "#fff" : "#f3f7fc",
                border: showSearch ? "1.5px solid #4988C4" : "1.5px solid #e5edf6",
              }}
              onClick={() => { setShowSearch(true); setTimeout(() => searchInputRef.current?.focus(), 30); }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#4988C4" }} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    navigate(searchResults[0].path);
                    setShowSearch(false); setSearchQuery("");
                  }
                }}
                placeholder="Search or navigate... ⌘K"
                className="flex-1 bg-transparent outline-none text-[13.5px] font-medium placeholder-gray-400 min-w-0"
                style={{ color: "#0F2854" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="flex-shrink-0 hover:opacity-70">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
              {!searchQuery && (
                <span className="hidden md:flex items-center gap-0.5 flex-shrink-0">
                  <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none"
                    style={{ background: "#e8f0fa", color: "#4988C4", border: "1px solid #cddff5" }}>⌘</kbd>
                  <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none"
                    style={{ background: "#e8f0fa", color: "#4988C4", border: "1px solid #cddff5" }}>K</kbd>
                </span>
              )}
            </div>

            {/* Search dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 rounded-2xl overflow-hidden shadow-xl z-50"
                style={{ background: "#fff", border: "1.5px solid #cddff5" }}>
                {searchResults.map((item) => (
                  <button key={item.path} onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#4988C4" }} />
                    <span className="text-[13px] font-medium" style={{ color: "#0F2854" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: actions ── */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto">

          {/* Mobile search icon */}
          <button
            onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setSearchQuery(""); setTimeout(() => mobileInputRef.current?.focus(), 50); }}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: "#4988C4" }}
            title="Search">
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Bookmarks */}
          <div className="relative" ref={bookmarkRef}>
            <button onClick={() => { setShowBookmarks(!showBookmarks); setShowNotifs(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: "#4988C4" }} title="Bookmarks">
              <Bookmark className="w-[18px] h-[18px]" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#0F2854" }} />
              )}
            </button>
            {showBookmarks && (
              <div className="fixed sm:absolute right-4 sm:right-0 top-[60px] sm:top-auto sm:mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #e8eef5" }}>
                  <span className="font-bold text-sm" style={{ color: "#0F2854" }}>Saved Careers</span>
                  {bookmarkedIds.length > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#e8f0fa", color: "#1C4D8D" }}>
                      {bookmarkedIds.length} saved
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {bookmarkedCareers.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bookmark className="w-8 h-8 mx-auto mb-2" style={{ color: "#cddff5" }} />
                      <p className="text-sm text-gray-400">
                        {bookmarkedIds.length > 0 ? "Generate recommendations to see saved careers" : "No bookmarks yet"}
                      </p>
                    </div>
                  ) : (
                    bookmarkedCareers.slice(0, 5).map((c) => (
                      <div key={c.careerId}
                        onClick={() => { navigate("/bookmarks"); setShowBookmarks(false); }}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b last:border-b-0"
                        style={{ borderColor: "#f0f7ff" }}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "#0F2854" }}>{c.title}</p>
                            <p className="text-xs text-gray-400 truncate">{c.category}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${
                            c.matchScore >= 70 ? "text-green-700 bg-green-50" : c.matchScore >= 45 ? "text-yellow-700 bg-yellow-50" : "text-red-600 bg-red-50"
                          }`}>{c.matchScore}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2.5" style={{ borderTop: "1px solid #e8eef5" }}>
                  <button onClick={() => { navigate("/bookmarks"); setShowBookmarks(false); }}
                    className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold hover:underline"
                    style={{ color: "#1C4D8D" }}>
                    View all bookmarks <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark mode (hidden on xs to save space) */}
          <button onClick={() => dispatch(toggleDarkMode())}
            className="hidden xs:flex w-9 h-9 items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: "#4988C4" }} title="Toggle dark mode">  
            {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotifs(!showNotifs)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: "#4988C4" }}>
              <Bell className="w-[18px] h-[18px]" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
            {showNotifs && (
              <div className="fixed sm:absolute right-4 sm:right-0 top-[60px] sm:top-auto sm:mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #e8eef5" }}>
                  <span className="font-bold text-sm" style={{ color: "#0F2854" }}>Notifications</span>
                  {unread > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{unread} new</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {!user?.notifications || user.notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">No notifications</p>
                  ) : (
                    user.notifications.slice(0, 8).map((n) => (
                      <div key={n._id} onClick={() => handleMarkRead(n._id)}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                          !n.read ? "bg-blue-50/50" : ""}`}
                        style={{ borderColor: "#f0f7ff" }}>
                        <p className={`${!n.read ? "font-semibold" : "text-gray-500"}`}
                          style={{ color: !n.read ? "#0F2854" : undefined }}>
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
          <button onClick={() => navigate("/profile")}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-colors ml-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
              style={{ background: "#1C4D8D" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12.5px] font-bold leading-tight" style={{ color: "#0F2854" }}>
                {user?.name?.split(" ")[0]}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">{user?.role || "Member"}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
          </button>
        </div>
      </div>

      {/* ── MOBILE SEARCH ROW ── */}
      {mobileSearchOpen && (
        <div className="fixed inset-x-0 top-[60px] z-50 sm:hidden px-3 pb-3" ref={mobileSearchRef}>
          <div className="rounded-2xl p-2 shadow-xl"
            style={{ background: "rgba(255,255,255,0.96)", border: "1px solid #e5edf6", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 rounded-2xl px-4 h-10 shadow-sm ring-2 ring-blue-200"
              style={{ background: "#fff", border: "1.5px solid #4988C4" }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#4988C4" }} />
              <input
                ref={mobileInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchResults.length > 0) {
                    navigate(searchResults[0].path);
                    setMobileSearchOpen(false); setSearchQuery("");
                  }
                }}
                placeholder="Search pages..."
                className="flex-1 bg-transparent outline-none text-[13.5px] font-medium placeholder-gray-400 min-w-0"
                style={{ color: "#0F2854" }}
              />
              <button onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); }}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "#fff", border: "1.5px solid #cddff5" }}>
                {searchResults.map((item) => (
                  <button key={item.path}
                    onClick={() => { navigate(item.path); setMobileSearchOpen(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left">
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#4988C4" }} />
                    <span className="text-[13px] font-medium" style={{ color: "#0F2854" }}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

