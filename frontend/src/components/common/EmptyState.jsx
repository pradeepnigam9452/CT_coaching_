import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No records found",
  message = "There are no items to display at this moment.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm my-4">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary btn-sm rounded-lg font-medium shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
