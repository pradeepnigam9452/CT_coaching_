import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, ExternalLink } from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await studentApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading notifications..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stay updated with class schedules, newly released study materials, and quiz evaluations.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          message="You are all caught up! New alerts and announcements will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.read
                  ? "bg-white border-slate-200/80 text-slate-700"
                  : "bg-indigo-50/50 border-indigo-200 text-indigo-950 shadow-sm"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(n.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    View
                  </Link>
                )}
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="btn btn-xs btn-ghost text-slate-500 hover:text-slate-800"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
