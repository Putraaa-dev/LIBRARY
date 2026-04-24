# TODO: MongoDB Atlas + Vercel Deployment

## Step 1: Setup Backend API (Vercel Serverless)
- [x] Create TODO.md
- [ ] Install dependencies: mongodb, @vercel/node
- [ ] Create `api/lib/db.ts` - MongoDB connection helper
- [ ] Create `api/books.ts` - GET, POST, PUT, DELETE books
- [ ] Create `api/users.ts` - GET, POST, PUT, DELETE users
- [ ] Create `api/loans.ts` - GET, POST, PUT loans
- [ ] Create `api/auth/login.ts` - Login endpoint
- [ ] Create `api/auth/register.ts` - Register endpoint
- [ ] Create `api/auth/me.ts` - Get current user endpoint

## Step 2: Migrate Frontend Contexts to API
- [ ] Update `src/app/context/AuthContext.tsx` - Use API instead of localStorage
- [ ] Update `src/app/context/LibraryContext.tsx` - Use API instead of localStorage
- [ ] Update `src/app/types.ts` - Add MongoDB _id compatibility

## Step 3: Vercel Config & Deploy
- [ ] Create `vercel.json` - SPA fallback + API routes
- [ ] Create `.env.local` template
- [ ] Update `package.json` scripts if needed
- [ ] Build test locally
- [ ] Deploy to Vercel
