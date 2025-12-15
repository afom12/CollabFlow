# Quick Start Guide

## ✅ Step 1: Dependencies Installed
Dependencies have been installed successfully! You can now run the development server.

## 🚀 Step 2: Start Development Server

Run this command:
```bash
npm run dev
```

The server should start on `http://localhost:3000`

## ⚙️ Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory with at minimum:

```env
# Database - You'll need PostgreSQL running
DATABASE_URL="postgresql://user:password@localhost:5432/collabflow?schema=public"

# NextAuth.js - Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🗄️ Step 4: Set Up Database (Optional for Basic Testing)

If you want to test database features:

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like Neon: https://neon.tech

2. **Create a database:**
   ```sql
   CREATE DATABASE collabflow;
   ```

3. **Update DATABASE_URL in .env.local** with your connection string

4. **Run Prisma migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

## 🎯 Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. You should see the landing page
3. Navigate to `/sign-up` to create an account
4. Or go to `/sign-in` to sign in

## ⚠️ Important Notes

### Without Database Setup:
- The app will run and you can see the UI
- Pages will load but database operations will fail
- You can still test the frontend components

### With Database Setup:
- Full functionality including:
  - User authentication
  - Creating teams
  - Creating documents
  - Creating projects and issues
  - Comments and notifications

## 🐛 Troubleshooting

### "next is not recognized"
- Make sure you ran `npm install` (already done ✅)
- Try deleting `node_modules` and running `npm install` again

### Port 3000 already in use
- Change the port: `npm run dev -- -p 3001`
- Or stop the other process using port 3000

### Database connection errors
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env.local`
- Verify database exists

### Build errors
- Run `npx prisma generate` if you see Prisma errors
- Check TypeScript errors: `npm run type-check`

## 📝 Next Steps

Once the server is running:
1. Visit `http://localhost:3000`
2. Explore the landing page
3. Try signing up (will need database for this to work)
4. Check out the dashboard (will need authentication)

For full features, set up:
- Database (PostgreSQL)
- Environment variables
- Prisma migrations

Happy coding! 🚀

