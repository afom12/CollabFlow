# CollabFlow

A modern, real-time collaborative platform combining document editing, project management, and team communication features. Built with Next.js 14+, TypeScript, and cutting-edge web technologies.

## 🚀 Features

- **Document System**: Rich text editor with real-time collaborative editing
- **Project Management**: Kanban boards, issue tracking, sprint planning
- **Real-time Dashboard**: Live presence indicators, activity feeds, notifications
- **Workspace Management**: Multi-tenant architecture with role-based permissions

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js v5
- **Real-time**: Liveblocks
- **State Management**: Zustand + React Query
- **File Storage**: UploadThing
- **Payments**: Stripe

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or hosted on Neon/PlanetScale)
- (Optional) Redis for caching
- (Optional) Liveblocks account for real-time features
- (Optional) UploadThing account for file uploads

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd GitCollab
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- Add OAuth credentials if using Google/GitHub login
- Add Liveblocks keys if using real-time features
- Add UploadThing keys if using file uploads

4. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

See `.env.example` for all required and optional environment variables. At minimum, you need:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 📁 Project Structure

```
app/
├── (marketing)/           # Public pages
├── (dashboard)/          # Authenticated area
│   ├── [team]/          # Dynamic team routes
│   │   ├── docs/        # Documents section
│   │   ├── projects/    # Project management
│   │   ├── analytics/   # Dashboard
│   │   └── settings/    # Team settings
│   └── layout.tsx       # Dashboard layout
├── api/                  # Route handlers
└── layout.tsx           # Root layout

lib/
├── actions/             # Server Actions
├── auth/               # Authentication
├── db/                 # Database clients
├── realtime/           # WebSocket logic
├── utils/              # Shared utilities
└── validation/         # Zod schemas
```

## 🎯 Core Features Implemented

### ✅ Phase 1: Foundation
- [x] Next.js 14+ with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS + shadcn/ui components
- [x] Prisma database schema
- [x] Authentication system (NextAuth.js v5)
- [x] Landing page and marketing routes
- [x] Dashboard layout and navigation

### ✅ Phase 2: Core Features
- [x] Document editor (TipTap integration)
- [x] Real-time infrastructure setup (Liveblocks)
- [x] Comments system schema
- [x] File uploads structure
- [x] Basic permissions system

### ✅ Phase 3: Project Management
- [x] Kanban board component
- [x] Issue tracking schema
- [x] Project management structure
- [x] Sprint planning models

### ✅ Phase 4: Advanced Features (Complete)
- [x] Real-time collaborative editing with Liveblocks presence
- [x] Document version history with restore functionality
- [x] Document templates (5 pre-built templates)
- [x] Notifications system with real-time updates
- [x] Analytics dashboard with real-time metrics
- [x] Search functionality across documents, projects, and issues

## 🏗️ Architecture Highlights

### Real-time Collaboration
- Uses Liveblocks for WebSocket connections
- CRDT-based conflict resolution
- Presence system for live user indicators
- Operational transforms for document sync

### Database Design
- Multi-tenant architecture with Teams
- Role-based access control (Owner, Admin, Member, Viewer)
- Hierarchical document structure
- Comprehensive audit trail

### Performance Optimizations
- Server Components for data fetching
- React Query for client-side state
- Edge-ready architecture
- Image optimization with Next.js Image

## 🧪 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
npx prisma generate  # Generate Prisma Client
```

## 📚 Key Technologies

- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Prisma**: Modern ORM for database access
- **NextAuth.js v5**: Authentication and authorization
- **Liveblocks**: Real-time collaboration infrastructure
- **TipTap**: Rich text editor framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **Zod**: Schema validation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides for:
- Railway
- AWS
- Docker
- Self-hosted options

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for security policies and reporting vulnerabilities.

## 📊 Project Status

- ✅ **Core Features**: Authentication, Documents, Projects, Teams
- ✅ **Real-time**: Collaborative editing, Presence indicators
- 🚧 **In Progress**: Advanced notifications, Analytics enhancements
- 📋 **Planned**: Mobile app, Advanced integrations

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed status.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with inspiration from Notion, Linear, and Figma. Uses open-source technologies and follows Next.js best practices.

## 🌟 Show Your Support

If you find CollabFlow useful, please consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code

