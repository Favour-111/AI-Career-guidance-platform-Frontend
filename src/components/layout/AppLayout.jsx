import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../store/slices/profileSlice";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { profile } = useSelector((s) => s.profile);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Scroll content area to top on every navigation
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Fetch profile on mount — thunk skips if data is still fresh (< 2 min old)
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="flex h-full bg-white dark:bg-dark-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
