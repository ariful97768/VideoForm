# Deployment Guide

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose authentication method (username/password)
   - Set privileges to "Read and write to any database"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IPs

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/video-form-db?retryWrites=true&w=majority
```

## Vercel Deployment

1. **Prepare Your Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/video-form-app.git
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables**
   - In Vercel project settings → "Environment Variables"
   - Add:
     ```
     MONGODB_URI=mongodb+srv://...
     NEXT_PUBLIC_GOOGLE_CALENDAR_URL=https://calendar.google.com/...
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

## Custom Domain Setup

1. **In Vercel Dashboard**
   - Go to your project → "Settings" → "Domains"
   - Click "Add"
   - Enter your domain name

2. **Update DNS Records**
   - Add these records to your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.21.21
   ```

## Performance Optimization

1. **Enable Image Optimization**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-video-cdn.com'],
  },
}
```

2. **Video Hosting Recommendations**
   - Use a CDN for videos (Cloudflare, AWS CloudFront)
   - Compress videos (H.264 codec, moderate quality)
   - Provide multiple resolutions for different devices
   - Consider adaptive bitrate streaming for large files

3. **Caching Strategy**
```javascript
// headers in next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

## Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - View real-time performance metrics

2. **MongoDB Atlas Monitoring**
   - Go to "Metrics" in Atlas dashboard
   - Monitor connection count, operations, storage

3. **Error Tracking (Optional)**
   - Integrate Sentry or LogRocket
   - Add error boundaries in React components

## Security Checklist

- [ ] Environment variables are not exposed in client-side code
- [ ] MongoDB IP whitelist is properly configured
- [ ] Rate limiting is implemented on API routes
- [ ] Input validation is in place
- [ ] HTTPS is enforced
- [ ] CORS is configured
- [ ] Database credentials are rotated regularly

## Troubleshooting

**Videos not playing:**
- Check video format (MP4 H.264 recommended)
- Verify CORS headers on video host
- Test video URLs directly in browser

**MongoDB connection issues:**
- Verify connection string format
- Check IP whitelist in Atlas
- Confirm database user permissions
- Test connection using MongoDB Compass

**Build failures:**
- Clear `.next` folder and `node_modules`
- Verify all dependencies are installed
- Check TypeScript errors: `npm run build`

**Performance issues:**
- Optimize video file sizes
- Use lazy loading for components
- Enable Next.js image optimization
- Consider using a CDN
