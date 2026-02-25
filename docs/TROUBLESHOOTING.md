# Troubleshooting Guide

Common issues and solutions for the Interactive Video Form application.

## 🎥 Video Issues

### Videos Not Playing

**Symptoms**: Black screen, video doesn't load, or error message

**Solutions**:
1. **Check video format**
   - Use MP4 with H.264 codec
   - Convert videos: `ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4`

2. **Check CORS headers**
   - If hosting videos externally, ensure CORS is enabled
   - Add these headers to your video server:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET
   ```

3. **Verify video URL**
   - Test URL directly in browser
   - Check for HTTPS (mixed content issues)

4. **Check file size**
   - Large files (>50MB) may timeout
   - Compress videos or use streaming

### Video Sound Not Working

**Symptoms**: Video plays but no audio after clicking play button

**Solutions**:
1. **Check browser autoplay policies**
   - Some browsers block autoplay with sound
   - Our app handles this correctly, but check console for errors

2. **Verify audio codec**
   - Use AAC audio codec
   - Check with: `ffmpeg -i video.mp4` (look for audio stream)

3. **Test on different browsers**
   - Try Chrome, Firefox, Safari
   - Mobile browsers may have stricter policies

### Video Performance Issues

**Symptoms**: Stuttering, buffering, slow loading

**Solutions**:
1. **Optimize video bitrate**
   ```bash
   ffmpeg -i input.mp4 -b:v 5M -maxrate 5M -bufsize 10M output.mp4
   ```

2. **Use a CDN**
   - Upload videos to Cloudflare, AWS CloudFront, or Bunny CDN
   - Reduces latency and improves loading times

3. **Provide multiple resolutions**
   - Create 720p version for mobile
   - Create 1080p version for desktop

## 🗄️ MongoDB Issues

### Connection Refused / Timeout

**Symptoms**: "MongoServerError: connect ECONNREFUSED" or timeout errors

**Solutions**:
1. **Check MongoDB is running**
   ```bash
   # On macOS/Linux
   sudo systemctl status mongod
   
   # Start MongoDB
   sudo systemctl start mongod
   ```

2. **Verify connection string**
   - Correct format: `mongodb://localhost:27017/video-form-db`
   - For Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

3. **Check IP whitelist (Atlas)**
   - Go to Network Access in Atlas
   - Add your IP or use 0.0.0.0/0 (allow all)

4. **Verify credentials**
   - Username and password are correct
   - User has read/write permissions

### Authentication Failed

**Symptoms**: "MongoServerError: Authentication failed"

**Solutions**:
1. **Check credentials in .env.local**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

2. **URL encode special characters**
   - If password has special chars (@, :, /, etc.)
   - Use URL encoding: `p@ssw0rd` → `p%40ssw0rd`

3. **Verify database user**
   - In Atlas: Database Access → Check user exists
   - Ensure "Read and write to any database" role

## 🚀 Build and Deployment Issues

### Build Fails

**Symptoms**: `npm run build` fails with TypeScript errors

**Solutions**:
1. **Clear build cache**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```
   - Fix any type errors shown

3. **Update dependencies**
   ```bash
   npm update
   npm install
   ```

### Environment Variables Not Working

**Symptoms**: `undefined` values in production

**Solutions**:
1. **Check variable naming**
   - Client-side vars MUST start with `NEXT_PUBLIC_`
   - Example: `NEXT_PUBLIC_GOOGLE_CALENDAR_URL`

2. **Rebuild after env changes**
   ```bash
   npm run build
   ```

3. **Verify in Vercel**
   - Project Settings → Environment Variables
   - Redeploy after adding variables

### 404 on API Routes

**Symptoms**: `/api/submit` returns 404

**Solutions**:
1. **Check file location**
   - Must be: `src/app/api/submit/route.ts`
   - Not: `src/pages/api/submit.ts` (old Next.js)

2. **Verify App Router is enabled**
   - Using Next.js 13+ with App Router
   - Check `next.config.js` doesn't disable it

## 📱 Mobile Layout Issues

### Overlay Not Visible

**Symptoms**: Text or buttons hidden on mobile

**Solutions**:
1. **Check viewport height**
   - Mobile browsers have dynamic viewport
   - Use `h-screen` instead of `height: 100vh`

2. **Test on real devices**
   - Chrome DevTools mobile emulation ≠ real device
   - Test on actual iOS/Android devices

3. **Adjust z-index**
   - Ensure overlays have higher z-index than video
   - Check in FormContainer mobile section

### Text Too Small

**Solutions**:
1. **Increase mobile font sizes**
   ```typescript
   className="text-2xl sm:text-3xl md:text-4xl"
   ```

2. **Adjust padding**
   ```typescript
   className="p-4 sm:p-6 lg:p-8"
   ```

## 🎨 Styling Issues

### Fonts Not Loading

**Symptoms**: Fallback fonts displayed instead of custom fonts

**Solutions**:
1. **Check Google Fonts URL**
   - Verify in `globals.css`
   - Test URL directly in browser

2. **Wait for font loading**
   - Add to layout: `<link rel="preconnect" href="https://fonts.googleapis.com" />`

3. **Check font names match**
   - In CSS: `font-family: 'Cormorant Garamond', serif;`
   - In Tailwind: `fontFamily: { display: ['Cormorant Garamond', 'serif'] }`

### Tailwind Classes Not Working

**Solutions**:
1. **Rebuild Tailwind**
   ```bash
   npm run dev
   ```

2. **Check content paths in tailwind.config.js**
   ```javascript
   content: [
     './src/**/*.{js,ts,jsx,tsx}',
   ],
   ```

3. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

## 🔧 Form Functionality Issues

### 5-Second Delay Not Working

**Solutions**:
1. **Check FormContainer.tsx**
   - Verify useEffect with setTimeout
   - Should be: `setTimeout(() => setCanContinue(true), 5000)`

2. **Check canContinue state**
   - Should reset on step change
   - Verify in useEffect with [currentStepIndex] dependency

### Form Data Not Saving

**Symptoms**: Progress lost on refresh

**Solutions**:
1. **Check sessionStorage**
   - Open DevTools → Application → Session Storage
   - Look for `video-form-progress` key

2. **Verify FormContainer saves data**
   ```typescript
   useEffect(() => {
     sessionStorage.setItem(
       STORAGE_KEY,
       JSON.stringify({ stepIndex: currentStepIndex, data: formData })
     );
   }, [currentStepIndex, formData]);
   ```

### Submission Not Working

**Symptoms**: Form submits but no data in database

**Solutions**:
1. **Check API route**
   - Visit `/api/submit` directly
   - Should return error (no POST data)

2. **Check browser console**
   - Look for network errors
   - Check request payload

3. **Verify MongoDB connection**
   - Test with: `npm run dev` and check console logs
   - Should see "Connected to MongoDB" (if you add logging)

## 🔍 Development Tips

### Hot Reload Not Working

**Solutions**:
1. **Restart dev server**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Check for TypeScript errors**
   - Terminal shows compilation errors
   - Fix errors to enable hot reload

3. **Clear .next folder**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Cannot Find Module Errors

**Solutions**:
1. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import paths**
   - Use `@/` alias for src directory
   - Example: `import Component from '@/components/Component'`

## 📊 Performance Optimization

### Slow Page Load

**Solutions**:
1. **Lazy load videos**
   ```typescript
   <video preload="metadata" />
   ```

2. **Optimize images and assets**
   - Use Next.js Image component
   - Compress images with tools like TinyPNG

3. **Enable production optimizations**
   ```bash
   npm run build
   npm start
   ```

### High Memory Usage

**Solutions**:
1. **Limit video resolution**
   - Use 720p for mobile
   - Use 1080p for desktop

2. **Clear browser cache**
   - DevTools → Network → Disable cache

3. **Check for memory leaks**
   - Use React DevTools Profiler
   - Ensure cleanup in useEffect

## 🆘 Getting Help

If you're still stuck:

1. **Check browser console**
   - Press F12 to open DevTools
   - Look for error messages

2. **Check Next.js logs**
   - Terminal running `npm run dev`
   - Look for compilation errors

3. **Search existing issues**
   - GitHub Issues
   - Stack Overflow
   - Next.js Discord

4. **Create an issue**
   - Provide error messages
   - Include browser/OS info
   - Share relevant code snippets

---

Remember: Most issues can be solved by:
1. Clearing caches and rebuilding
2. Checking environment variables
3. Verifying file paths and imports
4. Testing in multiple browsers
