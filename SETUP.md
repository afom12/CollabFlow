# CollabFlow Setup Guide

This guide will help you set up CollabFlow from scratch.

## Step-by-Step Setup

### 1. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE collabflow;
```
3. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/collabflow?schema=public"
```

#### Option B: Neon (Recommended for Development)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `.env`

#### Option C: PlanetScale

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Update Prisma schema to use MySQL:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Authentication Setup

#### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add to `.env`:
```
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### OAuth Providers (Optional)

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add to `.env`:
```
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Add to `.env`:
```
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

### 3. Real-time Setup (Liveblocks)

1. Sign up at [liveblocks.io](https://liveblocks.io)
2. Create a new project
3. Get your API keys
4. Add to `.env`:
```
LIVEBLOCKS_SECRET_KEY="your-secret-key"
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="your-public-key"
```

### 4. File Upload Setup (UploadThing)

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Get your keys
4. Add to `.env`:
```
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"
```

### 5. Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:
```
RESEND_API_KEY="your-api-key"
```

### 6. Payments Setup (Stripe) - Optional

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys
3. Add to `.env`:
```
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 7. Redis Setup (Optional, for Caching)

#### Local Redis:
```bash
# Install Redis
# macOS: brew install redis
# Linux: sudo apt-get install redis
# Windows: Use WSL or Docker

# Start Redis
redis-server

# Add to .env
REDIS_URL="redis://localhost:6379"
```

#### Upstash Redis (Cloud):
1. Sign up at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy connection string to `.env`

## Running the Application

1. **Install dependencies:**
```bash
npm install
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Run database migrations:**
```bash
npx prisma migrate dev
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## First User Setup

1. Go to `/sign-up`
2. Create your account
3. You'll be redirected to create your first team
4. Start using CollabFlow!

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if using local)
- Check firewall settings for cloud databases

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check OAuth callback URLs match your `NEXTAUTH_URL`
- Ensure OAuth credentials are correct

### Real-time Features Not Working

- Verify Liveblocks keys are set correctly
- Check browser console for errors
- Ensure WebSocket connections aren't blocked

### Build Errors

- Run `npx prisma generate` after schema changes
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

- Explore the dashboard at `/dashboard`
- Create your first document
- Set up a project and add issues
- Invite team members

For more information, see the [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

