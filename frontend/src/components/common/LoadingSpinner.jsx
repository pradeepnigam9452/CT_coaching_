import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ text = "Loading data...", size = "md" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500">
      <Loader2 className={`animate-spin text-indigo-600 ${size === "lg" ? "w-10 h-10" : "w-6 h-6"}`} />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
