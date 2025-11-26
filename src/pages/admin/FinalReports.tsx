import { Id } from "../../../convex/_generated/dataModel";
import { useFinalReports } from "./hooks/useFinalReports";
import { ReportList } from "./components/reports/ReportList";
import { ReportDetailModal } from "./components/reports/ReportDetailModal";

export function FinalReports() {
  const {
    selectedProgram,
    setSelectedProgram,
    selectedTeam,
    setSelectedTeam,
    selectedReportId,
    setSelectedReportId,
    programs,
    teamsForProgram,
    reportsForTeam,
    selectedReportData,
    handleApproveReport,
    handleRequestRevision,
  } = useFinalReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Final Reports</h1>
        <p className="text-gray-600 mt-2">
          Review weekly reports submitted by students per team
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
            setSelectedReportId(null);
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
              setSelectedReportId(null);
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

      {/* Reports List */}
      {selectedTeam && reportsForTeam && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Reports</h2>
          </div>
          <div className="p-6">
            <ReportList
              reports={reportsForTeam}
              onSelectReport={setSelectedReportId}
            />
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReportId && selectedReportData && (
        <ReportDetailModal
          report={selectedReportData}
          teamName={teamsForProgram?.find((t) => t._id === selectedTeam)?.name || "Team"}
          onClose={() => setSelectedReportId(null)}
          onApprove={handleApproveReport}
          onRequestRevision={handleRequestRevision}
        />
      )}

      {!selectedTeam && selectedProgram && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Please select a team to view reports
        </div>
      )}

      {!selectedProgram && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Please select a program to view final reports
        </div>
      )}
    </div>
  );
}

