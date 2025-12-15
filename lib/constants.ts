export const APP_NAME = "CollabFlow"
export const APP_DESCRIPTION = "A modern, real-time collaborative platform"

export const TEAM_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
} as const

export const ISSUE_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  DONE: "done",
} as const

export const ISSUE_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const

export const ISSUE_TYPE = {
  TASK: "task",
  BUG: "bug",
  FEATURE: "feature",
  EPIC: "epic",
} as const

export const TEAM_PLANS = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const

