import React, { useState } from "react";
import { User, Phone, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { getErrorMessage } from "../../api/client";

export const TeacherProfile = () => {
  const { user, updateProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    specialization: user?.specialization || "",
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileMsg({ type: "", text: "" });
      await updateProfile(profileForm);
      setProfileMsg({ type: "success", text: "Faculty profile updated successfully!" });
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Faculty Instructor Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your public educator credentials, specialization, and authentication password.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center">
          <img
            src={
              user?.profileImage ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Teacher"}`
            }
            alt={user?.name}
            className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 object-cover shadow-sm"
          />

          <h3 className="text-lg font-bold text-slate-900 mt-3">{user?.name}</h3>
          <p className="text-xs text-slate-500">{user?.email}</p>

          <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mt-3">
            {user?.specialization || "Faculty Educator"}
          </span>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Instructor Information
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
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Specialization</label>
                <input
                  type="text"
                  value={profileForm.specialization}
                  onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                  placeholder="e.g. MERN Stack & Cloud"
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Profile Photo URL</label>
              <input
                type="url"
                value={profileForm.profileImage}
                onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                placeholder="https://..."
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Bio & Experience</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3}
                placeholder="Share your industry experience and teaching style..."
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* Password Update */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Change Password
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
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="input input-sm input-bordered w-full rounded-xl"
            />
          </div>

          <div>
            <label className="label text-xs font-bold text-slate-600">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="input input-sm input-bordered w-full rounded-xl"
            />
          </div>

          <div>
            <label className="label text-xs font-bold text-slate-600">Confirm Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
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

export default TeacherProfile;
