import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new task
export const create = mutation({
  args: {
    teamId: v.id("teams"),
    title: v.string(),
    description: v.optional(v.string()),
    assignedMembers: v.array(v.id("users")),
    startTime: v.string(),
    endTime: v.string(),
    week: v.optional(v.string()),
    createdBy: v.id("users"),
    workProgramId: v.optional(v.id("work_programs")),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      teamId: args.teamId,
      title: args.title,
      description: args.description,
      assignedMembers: args.assignedMembers,
      startTime: args.startTime,
      endTime: args.endTime,
      week: args.week,
      createdBy: args.createdBy,
      createdAt: new Date().toISOString(),
      workProgramId: args.workProgramId,
      completed: false,
    });
    return taskId;
  },
});

// Update a task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedMembers: v.optional(v.array(v.id("users"))),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    workProgramId: v.optional(v.id("work_programs")),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete a task
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Add a task update (notes, files, progress)
export const addUpdate = mutation({
  args: {
    taskId: v.id("tasks"),
    memberId: v.id("users"),
    notes: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    progress: v.optional(v.number()), // If linked to WP
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("task_updates", {
      taskId: args.taskId,
      memberId: args.memberId,
      notes: args.notes,
      attachments: args.attachments,
      progress: args.progress,
      updatedAt: new Date().toISOString(),
    });

    // If progress is provided and task is linked to WP, update WP progress
    if (args.progress !== undefined) {
      const task = await ctx.db.get(args.taskId);
      if (task && task.workProgramId) {
        // Check if WP progress entry exists
        const existingWPProgress = await ctx.db
          .query("work_program_progress")
          .withIndex("by_work_program_member", (q) =>
            q.eq("workProgramId", task.workProgramId!).eq("memberId", args.memberId)
          )
          .first();

        if (existingWPProgress) {
          await ctx.db.patch(existingWPProgress._id, {
            percentage: args.progress,
            updatedAt: new Date().toISOString(),
          });
        } else {
          await ctx.db.insert("work_program_progress", {
            workProgramId: task.workProgramId,
            memberId: args.memberId,
            percentage: args.progress,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
  },
});

// Get tasks by team
export const getByTeam = query({
  args: {
    teamId: v.id("teams"),
    week: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    
    const filteredTasks = args.week 
      ? tasks.filter(t => t.week === args.week || t.startTime.startsWith(args.week!)) 
      : tasks;

    // Enrich with WP info
    return Promise.all(
      filteredTasks.map(async (task) => {
        const workProgram = task.workProgramId
          ? await ctx.db.get(task.workProgramId)
          : null;
        return { ...task, workProgram };
      })
    );
  },
});

// Get tasks by user (assigned)
export const getByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const allTasks = await ctx.db.query("tasks").collect();
    const assignedTasks = allTasks.filter((task) =>
      task.assignedMembers.includes(args.userId)
    );

    // Enrich with WP info
    return Promise.all(
      assignedTasks.map(async (task) => {
        const workProgram = task.workProgramId
          ? await ctx.db.get(task.workProgramId)
          : null;
        return { ...task, workProgram };
      })
    );
  },
});

// Get updates for a task
export const getUpdates = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const updates = await ctx.db
      .query("task_updates")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    // Enrich with user info
    return Promise.all(
      updates.map(async (u) => {
        const user = await ctx.db.get(u.memberId);
        return { ...u, user };
      })
    );
  },
});

// Get all task updates (for Files Sidebar)
export const getAllUpdatesByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // This might be expensive if not indexed by user directly in updates
    // But we have by_member index on task_updates
    const updates = await ctx.db
      .query("task_updates")
      .withIndex("by_member", (q) => q.eq("memberId", args.userId))
      .collect();

    // Enrich with task info
    return Promise.all(
      updates.map(async (u) => {
        const task = await ctx.db.get(u.taskId);
        return { ...u, task };
      })
    );
  },
});

// Get task by ID
export const getById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) return null;
    const workProgram = task.workProgramId
      ? await ctx.db.get(task.workProgramId)
      : null;
    return { ...task, workProgram };
  },
});
