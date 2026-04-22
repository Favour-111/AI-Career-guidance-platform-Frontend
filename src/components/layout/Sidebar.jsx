import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  User,
  Lightbulb,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  LogOut,
  X,
  BrainCircuit,
  ChevronRight,
  Bookmark,
} from "lucide-react";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    desc: "Overview & stats",
  },
  {
    to: "/profile",
    label: "My Profile",
    icon: User,
    desc: "Skills & education",
  },
  {
    to: "/recommendations",
    label: "Recommendations",
    icon: Lightbulb,
    desc: "AI career matches",
  },
  {
    to: "/market-trends",
    label: "Market Trends",
    icon: TrendingUp,
    desc: "Salary & demand",
  },
  {
    to: "/learning",
    label: "Learning Paths",
    icon: BookOpen,
    desc: "Courses & resources",
  },
  {
    to: "/bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
    desc: "Saved careers",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.profile);

  const completion = profile?.completionPercentage || 0;
  const skillCount = profile?.skills?.length || 0;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NavItem = ({ to, label, icon: Icon, desc }) => {
    const active = location.pathname === to;
    return (
      <NavLink
        to={to}
        onClick={onClose}
        className="group flex items-center gap-3 px-3 py-[9px] rounded-xl transition-all duration-200 relative overflow-hidden"
        style={
          active
            ? {
                background: "rgba(73,136,196,0.2)",
                borderLeft: "2.5px solid #BDE8F5",
              }
            : {}
        }
      >
        {!active && (
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        )}
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: active
              ? "rgba(73,136,196,0.35)"
              : "rgba(255,255,255,0.07)",
          }}
        >
          <Icon
            size={15}
            style={{ color: active ? "#BDE8F5" : "rgba(189,232,245,0.45)" }}
          />
        </span>
        <span className="flex-1 min-w-0">
          <span
            className="block text-[13px] font-semibold leading-tight"
            style={{ color: active ? "#fff" : "rgba(255,255,255,0.7)" }}
          >
            {label}
          </span>
          <span
            className="block text-[10px] leading-tight mt-[2px] truncate"
            style={{
              color: active
                ? "rgba(189,232,245,0.5)"
                : "rgba(189,232,245,0.22)",
            }}
          >
            {desc}
          </span>
        </span>
        {active && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#4988C4" }}
          />
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-30 h-full w-[250px] flex flex-col select-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      style={{
        background:
          "linear-gradient(175deg, #0D2347 0%, #081629 55%, #060E1F 100%)",
      }}
    >
      {/* Top shimmer */}
      <div
        className="h-[2px] w-full flex-shrink-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #4988C4 50%, transparent 100%)",
        }}
      />

      {/* ── LOGO ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1C4D8D 0%, #0F2854 100%)",
              boxShadow:
                "0 0 0 1.5px rgba(189,232,245,0.2), 0 4px 14px rgba(9,27,58,0.6)",
            }}
          >
            <BrainCircuit
              className="w-[18px] h-[18px]"
              style={{ color: "#BDE8F5" }}
            />
          </div>
          <div>
            <p className="text-white font-extrabold text-[15px] leading-none tracking-tight">
              CareerAI
            </p>
            <p
              className="text-[9.5px] font-semibold uppercase tracking-[0.13em] mt-[3px]"
              style={{ color: "rgba(189,232,245,0.4)" }}
            >
              Guidance Platform
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: "rgba(189,232,245,0.45)" }}
        >
          <X className="w-[15px] h-[15px]" />
        </button>
      </div>

      {/* ── PROFILE CARD ── */}
      <div
        className="mx-3 mb-4 rounded-2xl p-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(189,232,245,0.09)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-bold text-[15px] text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #4988C4 0%, #1C4D8D 100%)",
              boxShadow: "0 0 0 2px rgba(189,232,245,0.15)",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-[13px] leading-tight truncate">
              {user?.name}
            </p>
            <p
              className="text-[11px] truncate mt-[3px]"
              style={{ color: "rgba(189,232,245,0.42)" }}
            >
              {user?.email}
            </p>
            {user?.role === "admin" && (
              <span
                className="inline-block mt-1 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded"
                style={{
                  background: "rgba(73,136,196,0.28)",
                  color: "#BDE8F5",
                }}
              >
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Completion bar */}
        <div>
          <div className="flex justify-between items-center mb-[5px]">
            <span
              className="text-[10.5px] font-medium"
              style={{ color: "rgba(189,232,245,0.45)" }}
            >
              Profile completion
            </span>
            <span
              className="text-[10.5px] font-bold"
              style={{
                color: completion >= 80 ? "#BDE8F5" : "rgba(189,232,245,0.45)",
              }}
            >
              {completion}%
            </span>
          </div>
          <div
            className="h-[5px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completion}%`,
                background:
                  completion >= 80
                    ? "linear-gradient(90deg, #1C4D8D, #4988C4)"
                    : "linear-gradient(90deg, #1C4D8D, #4988C4)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-[7px]">
            <span
              className="text-[10px]"
              style={{ color: "rgba(189,232,245,0.3)" }}
            >
              {skillCount} skill{skillCount !== 1 ? "s" : ""} added
            </span>
            <NavLink
              to="/profile"
              onClick={onClose}
              className="text-[10px] font-semibold flex items-center gap-[2px] hover:opacity-75 transition-opacity"
              style={{ color: "#4988C4" }}
            >
              {completion < 100 ? "Complete profile" : "View profile"}
              <ChevronRight className="w-[10px] h-[10px]" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* ── NAV LABEL ── */}
      <p
        className="px-5 mb-[7px] text-[9.5px] font-bold uppercase tracking-[0.14em]"
        style={{ color: "rgba(189,232,245,0.25)" }}
      >
        Navigation
      </p>

      {/* ── MAIN NAV ── */}
      <nav className="flex-1 px-3 space-y-[2px] overflow-y-auto pb-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {user?.role === "admin" && (
          <>
            <div className="pt-3 pb-[7px] px-1">
              <div
                className="h-px"
                style={{ background: "rgba(189,232,245,0.07)" }}
              />
              <p
                className="mt-[9px] text-[9.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "rgba(189,232,245,0.25)" }}
              >
                Admin
              </p>
            </div>
            <NavItem
              to="/admin"
              label="Admin Panel"
              icon={ShieldCheck}
              desc="Users & analytics"
            />
          </>
        )}
      </nav>

      {/* ── FOOTER / SIGN OUT ── */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(189,232,245,0.07)" }}
      >
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-[9px] rounded-xl transition-all duration-200 relative overflow-hidden"
        >
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ background: "rgba(239,68,68,0.09)" }}
          />
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative"
            style={{ background: "rgba(239,68,68,0.13)" }}
          >
            <LogOut size={14} style={{ color: "rgba(252,165,165,0.75)" }} />
          </span>
          <span
            className="text-[13px] font-semibold relative"
            style={{ color: "rgba(252,165,165,0.75)" }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
