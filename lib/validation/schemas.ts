import { z } from "zod"

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.any().optional(),
  teamId: z.string(),
  parentId: z.string().optional(),
})

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string(),
  teamId: z.string(),
  assigneeId: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  type: z.enum(["task", "bug", "feature", "epic"]).default("task"),
})

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  teamId: z.string(),
})

