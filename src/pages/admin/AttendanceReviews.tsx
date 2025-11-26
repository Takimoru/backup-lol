import { Id } from "../../../convex/_generated/dataModel";
import { useAttendanceReviews } from "./hooks/useAttendanceReviews";
import { AttendanceControls } from "./components/attendance/AttendanceControls";
import { AttendanceTable } from "./components/attendance/AttendanceTable";

export function AttendanceReviews() {
  const {
    selectedProgram,
    setSelectedProgram,
    selectedTeam,
    setSelectedTeam,
    selectedWeek,
    programs,
    teamsForProgram,
    attendanceSummary,
    handleWeekChange,
    handleExportAttendance,
    getTeamMembers,
    formatWeekRange,
    formatDate,
  } = useAttendanceReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Reviews</h1>
        <p className="text-gray-600 mt-2">
          Review student attendance submissions per team
        </p>
      </div>

      {/* Program Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Program
        </label>
        <select
          value={selectedProgram || ""}
          onChange={(e) => {
            setSelectedProgram(e.target.value as Id<"programs"> | null);
            setSelectedTeam(null);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select a program</option>
          {programs?.map((program) => (
            <option key={program._id} value={program._id}>
              {program.title}
            </option>
          ))}
        </select>
      </div>

      {/* Team Selection */}
      {selectedProgram && (
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Team
          </label>
          <select
            value={selectedTeam || ""}
            onChange={(e) => {
              setSelectedTeam(e.target.value as Id<"teams"> | null);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select a team</option>
            {teamsForProgram?.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name || `Team ${team._id.slice(-6)}`} - {team.leader?.name || "Unknown"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Attendance Summary */}
      {selectedTeam && attendanceSummary && (
        <div className="bg-white rounded-lg shadow">
          <AttendanceControls
            weekRange={formatWeekRange(attendanceSummary)}
            selectedWeek={selectedWeek}
            programName={programs?.find(p => p._id === selectedProgram)?.title || "Unknown Program"}
            onWeekChange={handleWeekChange}
            onExport={handleExportAttendance}
          />
          <AttendanceTable
            attendanceSummary={attendanceSummary}
            members={getTeamMembers(teamsForProgram?.find((t) => t._id === selectedTeam))}
            formatDate={formatDate}
          />
        </div>
      )}

      {selectedTeam && !attendanceSummary && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Loading attendance data...
        </div>
      )}

      {!selectedTeam && selectedProgram && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Please select a team to view attendance
        </div>
      )}

      {!selectedProgram && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Please select a program to view attendance reviews
        </div>
      )}
    </div>
  );
}

