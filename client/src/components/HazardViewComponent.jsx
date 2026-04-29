import { useState, useEffect, useCallback } from "react";

const SEVERITY_CONFIG = {
  HIGH: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800",
    border: "border-red-200",
  },
  MEDIUM: {
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
  },
  LOW: {
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-800",
    border: "border-green-200",
  },
};

const SEVERITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const ALL_SEVERITIES = ["ALL", "HIGH", "MEDIUM", "LOW"];

function ShieldIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2L3.5 5v5c0 3.87 2.76 7.49 6.5 8.5C13.74 17.49 16.5 13.87 16.5 10V5L10 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.5 10.5L9 12L12.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className = "", spinning = false }) {
  return (
    <svg
      className={`${className} ${spinning ? "animate-spin" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.7 0 3.22.78 4.25 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M12 1.5V5h-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReportItem({ report }) {
  const cfg = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.LOW;
  return (
    <div className={`rounded-xl border px-4 py-3 bg-white ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{report.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${cfg.badge}`}>
              {report.severity}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{report.description}</p>
        </div>
      </div>
    </div>
  );
}

function HazardViewModal({ onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5001/get/feedback");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const sorted = [...(json.reports || [])].sort(
        (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
      );
      setReports(sorted);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const visible = filter === "ALL" ? reports : reports.filter((r) => r.severity === filter);
  const highCount = reports.filter((r) => r.severity === "HIGH").length;
  const medCount = reports.filter((r) => r.severity === "MEDIUM").length;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <ShieldIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">Campus Hazards</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading ? "Loading..." : error ? "Failed to load" : lastUpdated ? `Updated ${lastUpdated}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary strip */}
        {!loading && !error && (
          <div className="flex gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-900">{reports.length}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex-1 text-center">
              <p className={`text-lg font-semibold ${highCount > 0 ? "text-red-600" : "text-gray-400"}`}>{highCount}</p>
              <p className="text-xs text-gray-400">High</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex-1 text-center">
              <p className={`text-lg font-semibold ${medCount > 0 ? "text-amber-500" : "text-gray-400"}`}>{medCount}</p>
              <p className="text-xs text-gray-400">Medium</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {!loading && !error && (
          <div className="flex gap-1.5 px-5 py-3 border-b border-gray-100">
            {ALL_SEVERITIES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-1 text-xs font-medium rounded-lg px-2 py-1.5 transition-colors ${
                  filter === s
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Report list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2 max-h-72">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <RefreshIcon className="w-5 h-5 text-gray-300" spinning />
              <p className="text-sm text-gray-400">Fetching reports...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-500 font-medium">Connection error</p>
              <p className="text-xs text-gray-400 mt-1">Make sure the backend is running on port 5001.</p>
              <button
                onClick={fetchReports}
                className="mt-3 text-xs text-orange-600 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 font-medium">No reports found</p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === "ALL" ? "No hazards have been reported yet." : `No ${filter.toLowerCase()} severity reports.`}
              </p>
            </div>
          )}

          {!loading && !error && visible.map((report, i) => (
            <ReportItem key={i} report={report} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {visible.length} of {reports.length} report{reports.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={fetchReports}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <RefreshIcon className="w-3 h-3" spinning={loading} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default HazardViewModal;
