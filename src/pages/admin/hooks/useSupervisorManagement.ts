import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { SupervisorForm } from "../types/supervisor";
import { useAuth } from "../../../contexts/AuthContext";

export function useSupervisorManagement() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<Id<"users"> | null>(null);
  const [formData, setFormData] = useState<SupervisorForm>({
    email: "",
    name: "",
    nidn: "",
    password: "",
  });

  const users = useQuery(api.users.getAllUsers, {});
  const supervisors = users?.filter((u) => u.role === "supervisor") || [];

  const createSupervisorMutation = useMutation(api.users.createSupervisor);
  const updateSupervisorMutation = useMutation(api.users.updateSupervisor);
  const deleteSupervisorMutation = useMutation(api.users.deleteSupervisor);

  const resetForm = () => {
    setFormData({ email: "", name: "", nidn: "", password: "" });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreateSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    try {
      await createSupervisorMutation({
        ...formData,
        adminId: user._id,
      });
      toast.success("Supervisor created successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create supervisor");
    }
  };

  const handleUpdateSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    try {
      const { password, ...updateData } = formData;
      await updateSupervisorMutation({
        supervisorId: editingId,
        adminId: user._id,
        ...updateData,
        ...(password ? { password } : {}),
      });
      toast.success("Supervisor updated successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update supervisor");
    }
  };

  const handleDeleteSupervisor = async (id: Id<"users">) => {
    if (!user?._id) {
      toast.error("You must be logged in as admin");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this supervisor? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteSupervisorMutation({
        supervisorId: id,
        adminId: user._id,
      });
      toast.success("Supervisor deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supervisor");
    }
  };

  const startEditing = (supervisor: any) => {
    setEditingId(supervisor._id);
    setFormData({
      email: supervisor.email,
      name: supervisor.name,
      nidn: supervisor.nidn || "",
      password: "",
    });
    setIsCreating(true);
  };

  return {
    isCreating,
    setIsCreating,
    editingId,
    formData,
    setFormData,
    supervisors,
    handleCreateSupervisor,
    handleUpdateSupervisor,
    handleDeleteSupervisor,
    startEditing,
    resetForm,
  };
}
