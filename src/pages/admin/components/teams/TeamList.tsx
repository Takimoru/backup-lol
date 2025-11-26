import { Edit2, Trash2, Users } from "lucide-react";
import { EnrichedTeam } from "../../types/team";
import { Id } from "../../../../../convex/_generated/dataModel";

interface TeamListProps {
  teams: EnrichedTeam[];
  onEdit: (team: EnrichedTeam) => void;
  onDelete: (id: Id<"teams">) => void;
  onViewAttendance: (team: EnrichedTeam) => void;
}

export function TeamList({
  teams,
  onEdit,
  onDelete,
  onViewAttendance,
}: TeamListProps) {
  if (!teams || teams.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No teams created yet for this program
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <div
          key={team._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {team.name || `Team ${team._id.slice(-6)}`}
              </h3>
              <p className="text-sm text-gray-500">
                Leader: {team.leader?.name || "Unknown"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(team)}
                className="p-1 text-gray-400 hover:text-primary-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(team._id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Members ({team.members?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {team.members?.map((member) => (
                <span
                  key={member._id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => onViewAttendance(team)}
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="w-4 h-4" />
              <span>View Attendance</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
