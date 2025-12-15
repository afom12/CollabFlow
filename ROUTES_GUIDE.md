# CollabFlow Routes Guide

## 📍 Available Routes

### Public Routes
- **`/`** - Landing/Marketing page
- **`/sign-in`** - Sign in page
- **`/sign-up`** - Sign up page

### Dashboard Routes
- **`/dashboard`** - Main dashboard with overview and metrics
- **`/dashboard/activity`** - Global activity feed

### Team Routes (Replace `team` with your team slug)
- **`/[team]/docs`** - Documents list page
  - Create documents with templates
  - View all team documents
  
- **`/[team]/docs/[documentId]`** - Document editor page
  - Real-time collaborative editing
  - Comments section
  - Version history sidebar
  
- **`/[team]/projects`** - Projects list page
  - View all projects
  - Create new projects
  - Project cards with metrics
  
- **`/[team]/projects/[projectId]`** - Project Kanban board
  - Drag-and-drop issue management
  - Create issues
  - View issues by status
  
- **`/[team]/projects/[projectId]/[issueId]`** - Issue detail page
  - Full issue information
  - Status updates
  - Comments and discussion
  - Assignee management
  
- **`/[team]/settings`** - Team settings
  - Team information
  - Member management
  - Invite team members
  - Danger zone (delete team)
  
- **`/[team]/analytics`** - Analytics dashboard
  - Team metrics
  - Issue status breakdown
  - Activity insights
  - Performance charts
  
- **`/[team]/activity`** - Team activity feed
  - Real-time activity tracking
  - Team-specific metrics
  - Activity timeline

## 🎯 Quick Access Examples

To access team routes, replace `team` with your actual team slug:

```
/team/docs                    → Team documents
/team/projects                → Team projects
/team/projects/project-1      → Specific project Kanban board
/team/projects/project-1/123  → Specific issue
/team/settings                → Team settings
/team/analytics               → Team analytics
/team/activity                → Team activity
```

## 🧭 Navigation

The dashboard layout includes:
- **Sidebar Navigation**: Dashboard, Activity
- **Team Navigation** (when in team routes): Documents, Projects, Analytics, Settings
- **Header**: Notifications, Settings, User profile

## 📝 Notes

- Team routes use dynamic `[team]` parameter
- All team routes are protected (require authentication)
- Project and document IDs are dynamic
- Activity feeds show real-time updates
- Analytics pages show team metrics

## 🚀 Testing Routes

You can test these routes by navigating to:
1. Start at `/` (landing page)
2. Go to `/sign-in` or `/sign-up`
3. After login, go to `/dashboard`
4. Navigate to `/team/docs` (replace `team` with any slug like `my-team`)
5. Explore all the team routes!

