import React, { useState } from "react";
import { User, Phone, Mail, Lock, Sparkles, CheckCircle2, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { getErrorMessage } from "../../api/client";

export const StudentProfile = () => {
  const { user, updateProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileMsg({ type: "", text: "" });
      await updateProfile(profileForm);
      setProfileMsg({ type: "success", text: "Profile details updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: getErrorMessage(err) });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    try {
      setPasswordLoading(true);
      setPasswordMsg({ type: "", text: "" });
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: getErrorMessage(err) });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details, coaching preferences, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={
                user?.profileImage ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Student"}`
              }
              alt={user?.name}
              className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-100 object-cover shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-3">{user?.name}</h3>
          <p className="text-xs text-slate-500">{user?.email}</p>

          <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mt-3">
            Batch: {user?.batch || "General"}
          </span>

          <div className="w-full mt-6 pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Role:</span>
              <strong className="capitalize text-slate-800">{user?.role}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Phone:</span>
              <strong className="text-slate-800">{user?.phone || "—"}</strong>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Personal Details
          </h3>

          {profileMsg.text && (
            <div
              className={`alert mb-4 text-xs font-semibold rounded-xl ${
                profileMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="+91 98765 43210"
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                name="profileImage"
                value={profileForm.profileImage}
                onChange={handleProfileChange}
                placeholder="https://..."
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Bio / About Me</label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                placeholder="Aspiring Full Stack Engineer..."
                rows={3}
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20"
            >
              {profileLoading ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          Update Account Password
        </h3>

        {passwordMsg.text && (
          <div
            className={`alert mb-4 text-xs font-semibold rounded-xl ${
              passwordMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label text-xs font-bold text-slate-600">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              placeholder="••••••••"
              className="input input-sm input-bordered w-full rounded-xl"
            />
          </div>

          <div>
            <label className="label text-xs font-bold text-slate-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              placeholder="••••••••"
              className="input input-sm input-bordered w-full rounded-xl"
            />
          </div>

          <div>
            <label className="label text-xs font-bold text-slate-600">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              placeholder="••••••••"
              className="input input-sm input-bordered w-full rounded-xl"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn btn-sm bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
