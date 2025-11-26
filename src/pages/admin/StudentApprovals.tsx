import { useStudentApprovals } from "./hooks/useStudentApprovals";
import { RegistrationList } from "./components/student-approvals/RegistrationList";

export function StudentApprovals() {
  const {
    activeTab,
    setActiveTab,
    pendingRegistrations,
    approvedRegistrations,
    handleApproveRegistration,
    handleRejectRegistration,
  } = useStudentApprovals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and approve student registrations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "pending"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending
              {pendingRegistrations && pendingRegistrations.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-600 rounded-full">
                  {pendingRegistrations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "approved"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Approved
              {approvedRegistrations && approvedRegistrations.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                  {approvedRegistrations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pending Tab Content */}
        {activeTab === "pending" && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Pending Student Registrations
                </h2>
                <p className="text-sm text-gray-500">
                  Review documents and grant access based on submission email.
                </p>
              </div>
            </div>
            <RegistrationList
              registrations={pendingRegistrations}
              variant="pending"
              onApprove={handleApproveRegistration}
              onReject={handleRejectRegistration}
              emptyMessage="No pending registrations 🎉"
            />
          </div>
        )}

        {/* Approved Tab Content */}
        {activeTab === "approved" && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Approved Student Registrations
                </h2>
                <p className="text-sm text-gray-500">
                  List of students who have been approved and granted access.
                </p>
              </div>
            </div>
            <RegistrationList
              registrations={approvedRegistrations}
              variant="approved"
              emptyMessage="No approved registrations yet"
            />
          </div>
        )}
      </div>
    </div>
  );
}

