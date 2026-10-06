import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  Tag,
  Calendar,
  BookOpen,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, [selectedCourse]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getStudyMaterials(selectedCourse);
      setMaterials(res.materials || []);
      setCourses(res.courses || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase()) ||
    m.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading study materials..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Study Materials & Notes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Download PDF notes, cheat sheets, code repositories, and assignment references.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Filter Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs bg-slate-50"
          >
            <option value="all">All Enrolled Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No study materials available"
          message="Study materials uploaded by your instructors for this course will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {m.fileType || "PDF"} • {m.fileSize || "2 MB"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {m.course?.category || "General"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {m.description || "Course supplementary material & lecture notes."}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 truncate">
                    Course: {m.course?.title || "General Subject"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Uploaded by: {m.authorName || "Faculty Instructor"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3">
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent font-bold w-full rounded-xl transition-all inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download / View Document
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;
