import { CheckCircle } from "lucide-react";
import { AttendanceSummary, TeamMember } from "../../types/attendance";

interface AttendanceTableProps {
  attendanceSummary: AttendanceSummary;
  members: TeamMember[];
  formatDate: (dateStr: string) => string;
}

export function AttendanceTable({
  attendanceSummary,
  members,
  formatDate,
}: AttendanceTableProps) {
  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2 pr-4 font-medium">Student</th>
            {attendanceSummary.daily.map((day) => (
              <th key={day.date} className="py-2 px-2 font-medium text-center">
                {formatDate(day.date)}
              </th>
            ))}
            <th className="py-2 px-2 font-medium text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td className="py-2 pr-4 font-medium text-gray-900">
                {member.name}
              </td>
              {attendanceSummary.daily.map((day) => {
                const present = day.attendees.some(
                  (attendee) =>
                    attendee.userId === (member._id as unknown as string)
                );
                return (
                  <td
                    key={`${member._id}-${day.date}`}
                    className="py-2 px-2 text-center"
                  >
                    {present ? (
                      <CheckCircle className="w-4 h-4 text-green-600 inline" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                );
              })}
              <td className="py-2 px-2 text-center font-semibold text-gray-700">
                {attendanceSummary.totals.find(
                  (total) =>
                    total.userId === (member._id as unknown as string)
                )?.presentCount || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
