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
  Briefcase,
  Bookmark,
  Settings,
  HelpCircle,
  Zap,
  ChevronRight,
  MapPin,
} from "lucide-react";

const navItems = [
  { to: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { to: "/profile",         label: "My Profile",       icon: User },
  { to: "/recommendations", label: "Recommendations",  icon: Lightbulb },
  { to: "/market-trends",   label: "Market Trends",    icon: TrendingUp },
  { to: "/learning",        label: "Learning Paths",   icon: BookOpen },
  { to: "/chatbot",         label: "AI Chatbot",        icon: BrainCircuit },
  { to: "/bookmarks",       label: "Bookmarks",        icon: Bookmark },
];

const OWNER_ADMIN_EMAIL = "horbahstech@gmail.com";

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.profile);
  const isOwnerAdmin = user?.email?.toLowerCase() === OWNER_ADMIN_EMAIL;
  const visibleNavItems = isOwnerAdmin ? [] : navItems;

  const completion = profile?.completionPercentage || 0;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NavItem = ({ to, label, icon: Icon }) => {
    const active = location.pathname === to;
    return (
      <NavLink to={to} onClick={onClose}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
        style={active
          ? { background: "#f0f4ff", color: "#0F2854" }
          : { color: "#6b7280" }}>
        <Icon size={17}
          style={{ color: active ? "#0F2854" : "#9ca3af", flexShrink: 0 }}
          strokeWidth={active ? 2.2 : 1.8} />
        <span className="text-[13.5px] font-semibold leading-none"
          style={{ color: active ? "#0F2854" : "#6b7280" }}>
          {label}
        </span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 flex flex-col select-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: "#ffffff", borderRight: "1px solid #f0f0f0" }}>

        {/* ── LOGO ── */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#0F2854" }}>
              <Briefcase className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="font-black text-[17px] leading-none tracking-tight" style={{ color: "#0F2854" }}>
                Career Guidiance.
              </p>
              <div className="flex items-center gap-1 mt-[3px]">
                <MapPin size={9} style={{ color: "#4988C4" }} />
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#4988C4" }}>
                  Nigeria
                </p>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: "#9ca3af" }}>
            <X size={15} />
          </button>
        </div>

        {/* ── MENU LABEL ── */}
        <p className="px-5 mb-2 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "#b0b8c4" }}>
          {isOwnerAdmin ? "Admin" : "Menu"}
        </p>

        {/* ── NAV ── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-3">
          {visibleNavItems.map((item) => <NavItem key={item.to} {...item} />)}

          {isOwnerAdmin && (
            <>
              <div className="pt-4 pb-2 px-1">
                <div className="h-px bg-gray-100" />
                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#b0b8c4" }}>Admin</p>
              </div>
              <NavItem to="/admin" label="Admin Panel" icon={ShieldCheck} />
            </>
          )}
        </nav>

        {/* ── COMPLETE PROFILE CARD  hidden once profile is 100% ── */}
        {!isOwnerAdmin && completion < 100 && (
          <div className="mx-3 mb-4 rounded-2xl p-4 flex-shrink-0"
            style={{ background: "#fff8f0", border: "1px solid #ffe8cc" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#fff0dc" }}>
                <Zap size={14} style={{ color: "#f59e0b" }} />
              </div>
              <p className="font-black text-[13px] leading-tight" style={{ color: "#111827" }}>
                Complete your profile
              </p>
            </div>
            <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#9ca3af" }}>
              Get sharper AI career matches. {completion}% done  keep going!
            </p>
            <NavLink to="/profile" onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-90"
              style={{ background: "#111827", color: "#ffffff" }}>
              <Zap size={12} />
              Update profile
            </NavLink>
          </div>
        )}
        

        {/* ── FOOTER ── */}
        <div className="px-3 pb-4 flex-shrink-0 space-y-0.5"
          style={{ borderTop: "1px solid #f3f4f6" }}>
          <div className="pt-2" />
          {[
            // { icon: Settings, label: "Settings", to: "/settings" },
            { icon: HelpCircle, label: "Help & Support", to: "/help-support" },
          ].filter(() => !isOwnerAdmin).map(({ icon: Icon, label, to }) => (
            <button key={label}
              onClick={() => {
                navigate(to);
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50"
              style={{ color: "#6b7280" }}>
              <Icon size={16} style={{ color: "#9ca3af" }} strokeWidth={1.8} />
              <span className="text-[13px] font-medium">{label}</span>
            </button>
          ))}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-red-50 group">
            <LogOut size={16} style={{ color: "#f87171" }} strokeWidth={1.8} />
            <span className="text-[13px] font-medium" style={{ color: "#f87171" }}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

