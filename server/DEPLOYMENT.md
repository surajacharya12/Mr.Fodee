# Mr.Fodee Backend - Vercel Deployment Guide

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
cd server
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the **`server`** directory as the root
5. Click **"Deploy"**

#### Option B: Vercel CLI

```bash
npm i -g vercel
cd server
vercel
```

### 3. Add Environment Variables

In your Vercel project settings, add these environment variables:

**Required Variables:**

- `MONGO_URI` - Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD` - Admin password

**Example:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mrfoodie?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@fodee.com
ADMIN_PASSWORD=admin123
```

### 4. Update Frontend URLs

After deployment, Vercel will give you a URL like:
`https://your-project.vercel.app`

Update these files with your production URL:

**Client:**

- `client/.env.production`

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

**Admin:**

- `mr.fodee_admin/.env.production`

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### 5. Deploy Frontend

Deploy client and admin the same way:

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## 🔧 Troubleshooting

### CORS Errors

The backend is configured to accept requests from:

- `http://localhost:3000`
- `http://localhost:3002`
- `https://mr-fodee.vercel.app`
- `https://mr-fodee-admin.vercel.app`
- Any `*.vercel.app` domain

If you use a different domain, update `server/index.js` line 21-26.

### MongoDB Connection Issues

Make sure your MongoDB Atlas:

1. Allows connections from anywhere (0.0.0.0/0)
2. Has the correct username/password in the connection string
3. Database name is correct

### Profile Picture Not Loading

Ensure:

1. Cloudinary credentials are correct
2. CORS is properly configured
3. Image URLs are accessible

## 📝 Notes

- The backend uses serverless functions on Vercel
- MongoDB connections are optimized for serverless
- All routes support CORS for production domains
- Environment variables must be set in Vercel dashboard

## 🎉 Success!

Once deployed, your API will be available at:
`https://your-backend.vercel.app`

Test it by visiting:
`https://your-backend.vercel.app/`
(Should show: "Mr.Fodee API is running")
