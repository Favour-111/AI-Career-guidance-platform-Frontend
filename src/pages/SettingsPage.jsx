import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePreferences } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.emailNotifications ?? true,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEmailNotifications(user?.preferences?.emailNotifications ?? true);
  }, [user?.preferences?.emailNotifications]);

  const handleSave = async () => {
      setSaving(true);
    try {
      await dispatch(
        updatePreferences({
          darkMode: false,
          emailNotifications,
        }),
      ).unwrap();
      toast.success("Settings updated");
    } catch (err) {
      toast.error(err || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Preferences</p>
        <h1 className="mt-2 text-2xl font-black text-[#0F2854] dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
          Manage your app preferences and notification options.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Light mode is enforced across the platform.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 cursor-default dark:bg-gray-700 dark:text-gray-100"
              >
                Locked
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Email notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Receive important activity updates by email.
                </p>
              </div>
              <button
                onClick={() => setEmailNotifications((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  emailNotifications
                    ? "bg-[#0F2854] text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                }`}
              >
                {emailNotifications ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0F2854] text-white hover:opacity-95 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
