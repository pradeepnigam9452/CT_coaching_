import React from "react";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "indigo", // indigo, blue, emerald, amber, purple, rose
  trend,
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      gradient: "from-indigo-500 to-indigo-600",
    },
    blue: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
      gradient: "from-sky-500 to-blue-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      gradient: "from-emerald-500 to-teal-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      gradient: "from-amber-500 to-orange-600",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
      gradient: "from-purple-500 to-indigo-600",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      gradient: "from-rose-500 to-pink-600",
    },
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm card-hover relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentTheme.bg} ${currentTheme.text} shadow-sm`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.gradient}`}
      />
    </div>
  );
};

export default StatCard;
