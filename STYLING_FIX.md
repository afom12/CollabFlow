# Styling Not Working - Troubleshooting Guide

If you're seeing unstyled pages (just HTML without CSS), try these steps:

## Step 1: Hard Refresh Browser
- **Chrome/Edge**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Firefox**: Press `Ctrl + Shift + R`
- This clears the browser cache

## Step 2: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any errors related to CSS or Tailwind
4. Go to Network tab and check if `globals.css` is loading (status should be 200)

## Step 3: Verify Server is Running
Make sure you see output like:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
✓ Ready in X.Xs
```

## Step 4: Restart Dev Server
1. Stop the server (Ctrl + C)
2. Clear cache: Delete `.next` folder
3. Restart: `npm run dev`

## Step 5: Verify Files Exist
Check these files exist:
- ✅ `app/globals.css` - Should have `@tailwind` directives
- ✅ `tailwind.config.ts` - Should have content paths
- ✅ `postcss.config.js` - Should have tailwindcss plugin
- ✅ `app/layout.tsx` - Should import `./globals.css`

## Step 6: Check Tailwind Content Paths
The `tailwind.config.ts` should include:
```ts
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
```

## Step 7: Verify Dependencies
Run:
```bash
npm list tailwindcss postcss autoprefixer
```

All should be installed.

## Step 8: Test Tailwind Directly
Add this to any page to test:
```tsx
<div className="bg-blue-500 text-white p-4">
  This should be blue with white text
</div>
```

If this doesn't show blue, Tailwind isn't compiling.

## Common Issues:

### Issue: CSS file not loading
**Solution**: Check Network tab - if 404, the import path might be wrong

### Issue: Tailwind classes not applying
**Solution**: 
1. Make sure content paths in `tailwind.config.ts` match your file structure
2. Restart dev server after changing Tailwind config

### Issue: Styles compile but don't apply
**Solution**: 
1. Check for conflicting CSS
2. Verify `globals.css` is imported in root layout
3. Check browser DevTools for CSS conflicts

## Quick Fix Commands:

```bash
# Stop server
Ctrl + C

# Clear cache
rm -rf .next  # Linux/Mac
rmdir /s .next  # Windows CMD
Remove-Item -Recurse -Force .next  # PowerShell

# Reinstall dependencies (if needed)
npm install

# Restart server
npm run dev
```

## Still Not Working?

1. Check terminal for compilation errors
2. Check browser console for JavaScript errors
3. Verify you're accessing `http://localhost:3000` (not file://)
4. Try incognito/private browsing mode
5. Check if other Next.js apps work (to rule out system issues)

