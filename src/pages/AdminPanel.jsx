import { useEffect, useState } from "react";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import toast from "react-hot-toast";
import {
  Users,
  BarChart2,
  ShieldCheck,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Crown,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const loadStats = async () => {
    const { data } = await api.get("/admin/stats");
    setStats(data);
  };

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  const toggleActive = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}`, { isActive: !current });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !current } : u)),
      );
      toast.success(`User ${!current ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const toggleRole = async (id, current) => {
    const newRole = current === "admin" ? "user" : "admin";
    try {
      await api.patch(`/admin/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );
      toast.success(`Role changed to ${newRole}`);
    } catch {
      toast.error("Failed to change role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const monthlyData =
    stats?.usersByMonth
      ?.slice(0, 6)
      .reverse()
      .map((m) => ({
        name: `${m._id.month}/${String(m._id.year).slice(-2)}`,
        users: m.count,
      })) || [];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="card bg-gradient-brand text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-extrabold">Admin Panel</h1>
            <p className="text-white/70 text-sm">
              Platform management and analytics
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white dark:bg-dark-card rounded-xl shadow-sm border dark:border-dark-border w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === id
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: Users,
                color: "bg-primary/10 text-primary",
              },
              {
                label: "Active Users",
                value: stats.activeUsers,
                icon: UserCheck,
                color: "bg-green-100 text-green-600",
              },
              {
                label: "With Profiles",
                value: stats.totalProfiles,
                icon: Activity,
                color: "bg-blue-100 text-blue-600",
              },
              {
                label: "Inactive",
                value: stats.totalUsers - stats.activeUsers,
                icon: UserX,
                color: "bg-red-100 text-red-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* User growth chart */}
          {monthlyData.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-5">
                User Registrations (Monthly)
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C4D8D" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1C4D8D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#1C4D8D"
                    fill="url(#userGrad)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0F2854" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent activity */}
          <div className="card">
            <h2 className="section-title mb-4">Recent Platform Activity</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(stats.recentActivity || []).map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b dark:border-dark-border last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary dark:text-secondary">
                      {log.user?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      <span className="font-semibold">
                        {log.user?.name || "Unknown"}
                      </span>{" "}
                      {log.description || log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-400">{log.user?.email}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === "users" && (
        <div className="card">
          {/* Search & filter */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="input-field pl-9"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input-field sm:w-36"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" loading={loading}>
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("");
                loadUsers(1);
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-sm text-gray-400 mb-4">
            {pagination.total} users total
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-dark-border">
                    <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      User
                    </th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Joined
                    </th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-dark-border">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-surface dark:hover:bg-dark-surface transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`badge ${user.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "badge-primary"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-400">
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              toggleActive(user._id, user.isActive)
                            }
                            className={`p-1.5 rounded-lg text-xs transition-colors ${user.isActive ? "text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleRole(user._id, user.role)}
                            className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            title="Toggle admin"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => loadUsers(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      p === pagination.page
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-dark-surface text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
