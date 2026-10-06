import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, CheckCircle, Award, Users, BookOpen, Download } from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/common/StatCard";
import { getErrorMessage } from "../../api/client";

export const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReports();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Generating platform analytics report..." size="lg" />;

  const { summary } = data || {};

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Executive Reports & Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Macro metrics on platform enrollment completion rates, test clearance ratios, and learner engagement.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Curriculum Completion Rate"
          value={`${summary?.completionRate || 0}%`}
          subtitle="Of total active course enrollments"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Quiz Passing Ratio"
          value={`${summary?.testPassingRate || 0}%`}
          subtitle={`Across ${summary?.totalTestAttempts || 0} student attempts`}
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Total Active Learners"
          value={summary?.totalStudents || 0}
          subtitle={`Instructed by ${summary?.totalTeachers || 0} faculty members`}
          icon={Users}
          color="indigo"
        />
      </div>

      {/* Performance Summary Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Institutional Benchmark Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Course Engagement & Completion
            </h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Total Registered Enrollments:</span>
              <strong className="text-slate-900">{summary?.totalEnrollments || 0}</strong>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Active Courses Catalog:</span>
              <strong className="text-slate-900">{summary?.totalCourses || 0}</strong>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${summary?.completionRate || 50}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Examination & Testing Performance
            </h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Total Test Submissions:</span>
              <strong className="text-slate-900">{summary?.totalTestAttempts || 0}</strong>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Pass Percentage:</span>
              <strong className="text-emerald-700">{summary?.testPassingRate || 0}%</strong>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${summary?.testPassingRate || 60}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
