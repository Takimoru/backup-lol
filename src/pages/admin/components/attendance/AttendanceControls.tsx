import { Download } from "lucide-react";

interface AttendanceControlsProps {
  weekRange: string;
  selectedWeek: string;
  programName: string;
  onWeekChange: (direction: "prev" | "next") => void;
  onExport: () => void;
}

export function AttendanceControls({
  weekRange,
  selectedWeek,
  programName,
  onWeekChange,
  onExport,
}: AttendanceControlsProps) {
  return (
    <div className="p-6 border-b flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Weekly Attendance ({weekRange})
        </h2>
        <p className="text-sm text-gray-500">{programName}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onWeekChange("prev")}
          className="p-2 border rounded-lg hover:bg-gray-50"
        >
          ←
        </button>
        <span className="text-sm font-medium text-gray-700 px-3">
          Week {selectedWeek}
        </span>
        <button
          onClick={() => onWeekChange("next")}
          className="p-2 border rounded-lg hover:bg-gray-50"
        >
          →
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center space-x-2 px-3 py-2 border rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
