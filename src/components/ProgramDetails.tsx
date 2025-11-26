import { format } from "date-fns";
import { Calendar, Clock, Info } from "lucide-react";

interface Program {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy?: string;
}

interface Registration {
  _id: string;
  programId: string;
  status: "pending" | "approved" | "rejected";
}

interface ProgramDetailsProps {
  program: Program;
  registration?: Registration;
  onRegister?: () => void; // Placeholder for future interactivity
}

export function ProgramDetails({ program, registration }: ProgramDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(program.startDate), "MMMM d, yyyy")} -{" "}
                {format(new Date(program.endDate), "MMMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        {registration && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              registration.status === "approved"
                ? "bg-green-100 text-green-800"
                : registration.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            Registration: {registration.status}
          </span>
        )}
      </div>

      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">About this Program</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{program.description}</p>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Duration</p>
              <p className="text-sm text-gray-500">
                {Math.ceil(
                  (new Date(program.endDate).getTime() -
                    new Date(program.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Info className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Status</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
      </div>
      
      {!registration && (
         <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
               To register for this program, please use the public registration form or contact the administrator.
            </p>
         </div>
      )}
    </div>
  );
}
