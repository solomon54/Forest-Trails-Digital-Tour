import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Props {
  before?: Record<string, any>;
  after?: Record<string, any>;
}

function RenderObject({ data }: { data: Record<string, any> }) {
  return (
    <div className="space-y-1 text-xs">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between gap-3 border-b border-gray-100 py-1"
        >
          <span className="text-gray-500 font-medium truncate">
            {key}
          </span>
          <span className="text-gray-800 text-right break-all max-w-[60%]">
            {typeof value === "object"
              ? JSON.stringify(value)
              : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ActivityStates({ before, after }: Props) {
  const [showRaw, setShowRaw] = useState(false);

  if (!before && !after) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* Toggle */}
      <button
        onClick={() => setShowRaw((v) => !v)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
      >
        {showRaw ? <FiChevronUp /> : <FiChevronDown />}
        {showRaw ? "Hide raw data" : "View raw data"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {before && (
          <section className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <header className="bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600 uppercase">
              Before
            </header>

            <div className="p-3">
              {showRaw ? (
                <pre className="text-xs overflow-x-auto max-h-40 text-gray-500">
                  {JSON.stringify(before, null, 2)}
                </pre>
              ) : (
                <RenderObject data={before} />
              )}
            </div>
          </section>
        )}

        {after && (
          <section className="border border-emerald-200 rounded-lg overflow-hidden bg-white">
            <header className="bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 uppercase">
              After
            </header>

            <div className="p-3">
              {showRaw ? (
                <pre className="text-xs text-gray-500 overflow-x-auto max-h-40">
                  {JSON.stringify(after, null, 2)}
                </pre>
              ) : (
                <RenderObject data={after} />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
