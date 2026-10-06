import React, { useState } from "react";
import { Settings, Shield, Server, Bell, Save, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminSettings = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    institutionName: "CT Coaching Center & Learning Academy",
    supportEmail: "support@ctcoaching.edu",
    contactPhone: "+91 98765 43210",
    allowStudentRegistrations: true,
    maintenanceMode: false,
    defaultBatch: "FSD",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Configuration & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure coaching center metadata, registration controls, and system preferences.
        </p>
      </div>

      {saved && (
        <div className="alert alert-success bg-emerald-50 text-emerald-800 border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" /> Platform settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Institute Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-600" />
            Coaching Center Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label text-xs font-bold text-slate-600">Institution / Portal Name</label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Admissions & Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Official Helpline Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            Registration & Access Policies
          </h3>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Open Student Self-Registration</span>
                <span className="text-[11px] text-slate-500">Allow visitors to sign up as students from public website</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowStudentRegistrations}
                onChange={(e) => setSettings({ ...settings, allowStudentRegistrations: e.target.checked })}
                className="checkbox checkbox-sm checkbox-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Maintenance Mode</span>
                <span className="text-[11px] text-slate-500">Restrict learner access temporarily during database upgrades</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="checkbox checkbox-sm checkbox-secondary"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-sm sm:btn-md bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
