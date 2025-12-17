# Deployment Guide

This guide covers deploying CollabFlow to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (Neon, Supabase, or Railway)

### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   LIVEBLOCKS_SECRET_KEY=sk_live_...
   LIVEBLOCKS_PUBLIC_KEY=pk_live_...
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Generate Prisma Client** (if needed)
   ```bash
   npx prisma generate
   ```

## 🚂 Deploy to Railway

Railway provides easy PostgreSQL + app hosting.

### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database automatically

4. **Configure Environment Variables**
   
   In Railway dashboard:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.up.railway.app
   ```

5. **Deploy**
   - Railway will automatically deploy on push to main
   - Check logs for any issues

## ☁️ Deploy to AWS

### Option 1: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select branch (main)

2. **Configure Build Settings**
   
   Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npx prisma generate
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add all required env vars in Amplify console

4. **Deploy**
   - Amplify will build and deploy automatically

### Option 2: AWS EC2 + Docker

See Docker deployment section below.

## 🐳 Docker Deployment

### Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.js

Add output configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... rest of config
}

module.exports = nextConfig
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=collabflow
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=collabflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.com` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `LIVEBLOCKS_SECRET_KEY` | Liveblocks secret key |
| `LIVEBLOCKS_PUBLIC_KEY` | Liveblocks public key |
| `UPLOADTHING_SECRET` | UploadThing secret |
| `UPLOADTHING_APP_ID` | UploadThing app ID |

## 📊 Database Setup

### Production Migrations

Always run migrations in production:

```bash
npx prisma migrate deploy
```

### Database Providers

Recommended PostgreSQL providers:

- **Neon** - Serverless PostgreSQL (free tier available)
- **Supabase** - Open-source Firebase alternative
- **Railway** - Easy PostgreSQL hosting
- **PlanetScale** - MySQL (requires schema changes)
- **AWS RDS** - Managed PostgreSQL
- **DigitalOcean** - Managed databases

## 🔒 Security Checklist

Before deploying to production:

- [ ] Use HTTPS (most platforms do this automatically)
- [ ] Set secure `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use strong database passwords
- [ ] Enable database SSL/TLS
- [ ] Set up environment variable encryption
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy

## 📈 Monitoring

### Recommended Tools

- **Vercel Analytics** - Built-in analytics for Vercel
- **Sentry** - Error tracking and monitoring
- **LogRocket** - Session replay and debugging
- **Posthog** - Product analytics

### Setup Example (Sentry)

1. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

2. Initialize Sentry:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. Add environment variable:
   ```
   SENTRY_DSN=your-sentry-dsn
   ```

## 🚨 Troubleshooting

### Build Failures

- Check Node.js version (requires 18+)
- Ensure all dependencies are installed
- Verify environment variables are set
- Check Prisma Client is generated

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment platform
- Ensure SSL is configured if required
- Check firewall rules

### Runtime Errors

- Check application logs
- Verify all environment variables are set
- Ensure database migrations are run
- Check NextAuth configuration

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

