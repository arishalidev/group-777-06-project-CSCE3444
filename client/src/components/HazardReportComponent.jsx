import { useState } from "react";

const SEVERITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

const SEVERITY_CONFIG = {
  LOW: {
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-800",
    border: "border-green-200",
  },
  MEDIUM: {
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
  },
  HIGH: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800",
    border: "border-red-200",
  },
};

function HazardIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function HazardReportModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const params = new URLSearchParams({ name: name.trim(), description: description.trim(), severity });
      const res = await fetch(`http://localhost:5001/set/feedback?${params.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setSeverity("LOW");
    setStatus(null);
    setErrorMsg("");
    onClose?.();
  };

  const cfg = SEVERITY_CONFIG[severity];

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <HazardIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">Report a Hazard</h2>
              <p className="text-xs text-gray-400 mt-0.5">Submit a safety concern on campus</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form / Success */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10.5L8.5 14L15 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Report submitted</p>
              <p className="text-xs text-gray-400 mt-1">Thank you for helping keep campus safe.</p>
              <button
                onClick={handleClose}
                className="mt-4 text-xs text-gray-500 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-gray-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the hazard and its location..."
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-gray-300 resize-none"
                />
              </div>

              {/* Severity */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Severity</label>
                <div className="flex gap-2">
                  {SEVERITY_OPTIONS.map((opt) => {
                    const c = SEVERITY_CONFIG[opt];
                    const isSelected = severity === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setSeverity(opt)}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 border transition-all ${
                          isSelected
                            ? `${c.badge} ${c.border} border`
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? c.dot : "bg-gray-300"}`} />
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {status === "error" && (
                <p className="text-xs text-red-500">Failed to submit: {errorMsg}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {status !== "success" && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !description.trim() || status === "loading"}
              className="text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HazardReportModal;
