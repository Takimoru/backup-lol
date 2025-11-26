import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Registration, RegistrationTab } from "../types/student";

export function useStudentApprovals() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<RegistrationTab>("pending");

  const pendingRegistrations = useQuery(api.registrations.getPendingRegistrations, {}) as Registration[] | undefined;
  const approvedRegistrations = useQuery(api.registrations.getApprovedRegistrations, {}) as Registration[] | undefined;
  
  const approveRegistrationMutation = useMutation(api.registrations.approveRegistration);
  const rejectRegistrationMutation = useMutation(api.registrations.rejectRegistration);

  const handleApproveRegistration = async (registrationId: Id<"registrations">) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await approveRegistrationMutation({
        registrationId: registrationId,
        adminId: user._id,
      });
      toast.success("Registration approved!");
    } catch (error: any) {
      console.error("Failed to approve:", error);
      toast.error(error.message || "Failed to approve registration");
    }
  };

  const handleRejectRegistration = async (registrationId: Id<"registrations">) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (confirm("Are you sure you want to reject this registration?")) {
      try {
        await rejectRegistrationMutation({
          registrationId: registrationId,
          adminId: user._id,
        });
        toast.success("Registration rejected");
      } catch (error: any) {
        console.error("Failed to reject:", error);
        toast.error(error.message || "Failed to reject registration");
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    pendingRegistrations,
    approvedRegistrations,
    handleApproveRegistration,
    handleRejectRegistration,
  };
}
