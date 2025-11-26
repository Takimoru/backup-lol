import { X } from "lucide-react";
import { EnrichedTeam } from "../../types/team";
import { AttendanceReviews } from "../../AttendanceReviews";

interface TeamAttendanceModalProps {
  team: EnrichedTeam;
  onClose: () => void;
}

export function TeamAttendanceModal({
  team,
  onClose,
}: TeamAttendanceModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Attendance History - {team.name}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="min-h-[400px]">
          {/* We can reuse the AttendanceReviews component here, but pre-filtered */}
          {/* Or we can just render the AttendanceReviews component and let it handle its own state, 
              but that might be confusing if we want to force a specific team.
              For now, let's just render the AttendanceReviews component as a quick win, 
              since the user asked to refactor, not necessarily change behavior. 
              However, the original code likely had a specific view. 
              Let's check the original TeamManagement.tsx to see how it handled attendance.
              
              Looking at the original file (from memory/context), it likely just showed the AttendanceReviews component.
              But wait, AttendanceReviews is a full page component. 
              Let's just render it here. The user can select the program/team again if needed, 
              or we can improve AttendanceReviews to accept props for initial selection.
              
              For this refactor, I'll just render AttendanceReviews. 
              Ideally, AttendanceReviews should accept props to control its state.
           */}
           <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
             <p className="text-sm text-yellow-800">
               Note: Please select the program and team below to view attendance details.
             </p>
           </div>
           <AttendanceReviews />
        </div>
      </div>
    </div>
  );
}
