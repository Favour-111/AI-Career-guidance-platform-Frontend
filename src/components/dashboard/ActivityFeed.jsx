import { formatDistanceToNow } from "date-fns";
import {
  LogIn,
  UserCheck,
  Star,
  Bookmark,
  Upload,
  BarChart2,
  BookOpen,
  RefreshCw,
  Zap,
} from "lucide-react";

const ACTION_MAP = {
  login: {
    label: "Logged in",
    icon: LogIn,
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  logout: {
    label: "Logged out",
    icon: LogIn,
    color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
  profile_update: {
    label: "Updated profile",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  skill_update: {
    label: "Updated skills",
    icon: Star,
    color:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  recommendation_generated: {
    label: "Generated recommendations",
    icon: Zap,
    color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
  },
  career_bookmarked: {
    label: "Bookmarked career",
    icon: Bookmark,
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  resume_uploaded: {
    label: "Uploaded resume",
    icon: Upload,
    color:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  market_data_viewed: {
    label: "Viewed market trends",
    icon: BarChart2,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  course_viewed: {
    label: "Viewed a course",
    icon: BookOpen,
    color:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
};

export default function ActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        No activity yet. Start exploring!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((activity, i) => {
        const meta = ACTION_MAP[activity.action] || {
          label: activity.action,
          icon: RefreshCw,
          color: "bg-gray-100 text-gray-500",
        };
        const Icon = meta.icon;

        return (
          <div key={i} className="flex items-start gap-3 group">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {meta.label}
              </p>
              {activity.description && (
                <p className="text-xs text-gray-400 truncate">
                  {activity.description}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-1">
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
