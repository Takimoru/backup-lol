import { Id } from "../../../../convex/_generated/dataModel";

export interface ReportTask {
  _id: string;
  title: string;
  completed: boolean;
}

export interface ReportPhoto {
  url: string;
}

export interface SupervisorComment {
  comment: string;
  commentedBy: Id<"users">;
  commentedAt: number;
  commentedByUser?: {
    name: string;
  };
}

export interface WeeklyReport {
  _id: Id<"weeklyReports">;
  week: string;
  status: "draft" | "submitted" | "approved" | "revision_requested";
  progressPercentage: number;
  submittedAt?: number;
  description?: string;
  photos?: string[];
  tasks?: ReportTask[];
  supervisorComments?: SupervisorComment[];
}
