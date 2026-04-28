import { useState, useEffect, useCallback } from "react";

const SEVERITY_CONFIG = {
  Extreme: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800",
    border: "border-red-200",
    icon: "text-red-500",
  },
  Severe: {
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800",
    border: "border-amber-200",
    icon: "text-amber-500",
  },
  Moderate: {
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-800",
    border: "border-blue-200",
    icon: "text-blue-500",
  },
  Minor: {
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-800",
    border: "border-green-200",
    icon: "text-green-500",
  },
  Unknown: {
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-700",
    border: "border-gray-200",
    icon: "text-gray-400",
  },
};

const SEVERITY_ORDER = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3, Unknown: 4 };

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

function WarningIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2.5L17.5 15.5H2.5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.75" fill="currentColor" />
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

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertItem({ hazard }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[hazard.severity] || SEVERITY_CONFIG.Unknown;

  return (
    <button
      onClick={() => setExpanded((p) => !p)}
      className={`w-full text-left rounded-xl border px-4 py-3 transition-all duration-200 hover:bg-gray-50 focus:outline-none ${cfg.border} ${expanded ? "bg-gray-50" : "bg-white"}`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{hazard.event}</p>
            <ChevronIcon open={expanded} />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
              {hazard.severity}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {hazard.urgency}
            </span>
          </div>
          {expanded && hazard.description && (
            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-2.5">
              {hazard.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function WeatherAlertModal({ defaultState = "TX", onClose }) {
  const [state, setState] = useState(defaultState);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5001/api/weather/alerts?state=${state}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const sorted = [...(json.hazards || [])].sort(
        (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
      );
      setData({ ...json, hazards: sorted });
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const extremeCount = data?.hazards?.filter((h) => h.severity === "Extreme").length ?? 0;
  const severeCount  = data?.hazards?.filter((h) => h.severity === "Severe").length ?? 0;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <WarningIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">Weather Alerts</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Updating..."
                  : error
                  ? "Failed to load"
                  : lastUpdated
                  ? `${state} · Updated ${lastUpdated}`
                  : state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Summary strip */}
        {!loading && !error && data && (
          <div className="flex gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold text-gray-900">{data.count}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex-1 text-center">
              <p className={`text-lg font-semibold ${extremeCount > 0 ? "text-red-600" : "text-gray-400"}`}>
                {extremeCount}
              </p>
              <p className="text-xs text-gray-400">Extreme</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex-1 text-center">
              <p className={`text-lg font-semibold ${severeCount > 0 ? "text-amber-500" : "text-gray-400"}`}>
                {severeCount}
              </p>
              <p className="text-xs text-gray-400">Severe</p>
            </div>
          </div>
        )}

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2 max-h-72">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <RefreshIcon className="w-5 h-5 text-gray-300" spinning />
              <p className="text-sm text-gray-400">Fetching alerts...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-500 font-medium">Connection error</p>
              <p className="text-xs text-gray-400 mt-1">Make sure the backend is running on port 5001.</p>
              <button
                onClick={fetchAlerts}
                className="mt-3 text-xs text-amber-600 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && data?.hazards?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 font-medium">No active alerts</p>
              <p className="text-xs text-gray-400 mt-1">All clear for {state} right now.</p>
            </div>
          )}

          {!loading && !error && data?.hazards?.map((hazard, i) => (
            <AlertItem key={i} hazard={hazard} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {data ? `${data.count} active alert${data.count !== 1 ? "s" : ""}` : "—"}
          </p>
          <button
            onClick={fetchAlerts}
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

export default WeatherAlertModal;
