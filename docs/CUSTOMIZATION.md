# Customization Guide

This guide will help you customize the video form application to match your specific needs.

## 🎬 Customizing Form Steps

Edit `src/config/formSteps.ts` to define your form flow.

### Example: Creating a Product Feedback Form

```typescript
import { FormStep } from '@/types/form';

export const formSteps: FormStep[] = [
  // Step 1: Welcome
  {
    id: 'welcome',
    type: 'info',
    videoUrl: '/videos/welcome.mp4',
    question: 'Welcome! Let\'s hear your thoughts',
  },

  // Step 2: Product Rating
  {
    id: 'rating',
    type: 'multiple-choice',
    videoUrl: '/videos/rating-question.mp4',
    question: 'How would you rate our product?',
    fieldName: 'rating',
    options: [
      { id: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
      { id: '4', label: '⭐⭐⭐⭐ Very Good' },
      { id: '3', label: '⭐⭐⭐ Good' },
      { id: '2', label: '⭐⭐ Fair' },
      { id: '1', label: '⭐ Poor' },
    ],
  },

  // Step 3: Feedback Details
  {
    id: 'feedback',
    type: 'text-input',
    videoUrl: '/videos/feedback-question.mp4',
    question: 'What could we improve?',
    placeholder: 'Share your thoughts...',
    fieldName: 'feedback',
    inputType: 'textarea',
  },

  // Step 4: Contact Information
  {
    id: 'contact',
    type: 'form',
    videoUrl: '/videos/contact-question.mp4',
    question: 'How can we reach you for follow-up?',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        required: true,
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'john@example.com',
        required: true,
      },
      {
        name: 'phone',
        label: 'Phone Number (Optional)',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: false,
      },
    ],
  },

  // Step 5: Thank You
  {
    id: 'completion',
    type: 'completion',
    videoUrl: '/videos/thankyou.mp4',
    title: 'Thank You for Your Feedback!',
    message: 'We appreciate your time. Want to schedule a call?',
  },
];
```

## 🎨 Customizing Colors and Branding

### Method 1: Edit Tailwind Config

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#0066CC',  // Your brand blue
        dark: '#004C99',
        light: '#3385D6',
      },
      accent: {
        DEFAULT: '#FF6B35',  // Your accent color
        light: '#FF8C61',
      },
      background: {
        dark: '#1A1A1A',
        darker: '#0A0A0A',
      }
    },
    fontFamily: {
      display: ['Playfair Display', 'serif'],  // Your display font
      sans: ['Inter', 'sans-serif'],           // Your body font
    },
  },
}
```

### Method 2: CSS Variables

Edit `src/app/globals.css`:

```css
:root {
  --color-primary: #0066CC;
  --color-accent: #FF6B35;
  --font-display: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
}
```

## 🖼️ Using Custom Fonts

### Google Fonts

Edit `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');
```

### Self-Hosted Fonts

1. Add font files to `public/fonts/`
2. Define fonts in `globals.css`:

```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}
```

## 🎥 Video Configuration

### Recommended Video Specs

```
Format: MP4 (H.264)
Resolution: 1920x1080 (1080p)
Bitrate: 5-10 Mbps
Frame Rate: 30fps
Audio: AAC, 128 kbps
Duration: 10-30 seconds per step
```

### Video Hosting Options

1. **Self-hosted** (Next.js public folder)
```typescript
videoUrl: '/videos/step1.mp4'
```

2. **Cloud Storage** (AWS S3, Cloudinary)
```typescript
videoUrl: 'https://your-bucket.s3.amazonaws.com/video1.mp4'
```

3. **Video CDN** (Vimeo, Bunny CDN)
```typescript
videoUrl: 'https://player.vimeo.com/progressive_redirect/...'
```

### Multiple Video Qualities

For better performance, provide multiple resolutions:

```typescript
// Create a helper function
const getVideoUrl = (quality: 'mobile' | 'desktop') => {
  if (quality === 'mobile') {
    return '/videos/step1-720p.mp4';
  }
  return '/videos/step1-1080p.mp4';
};

// Use in config
videoUrl: typeof window !== 'undefined' && window.innerWidth < 768 
  ? getVideoUrl('mobile') 
  : getVideoUrl('desktop')
```

## 🔧 Adjusting the 5-Second Delay

Edit `src/components/FormContainer.tsx`:

```typescript
// Change delay from 5 seconds to 3 seconds
useEffect(() => {
  setCanContinue(false);
  setVideoTime(0);

  const timer = setTimeout(() => {
    setCanContinue(true);
  }, 3000); // Changed from 5000 to 3000

  return () => clearTimeout(timer);
}, [currentStepIndex]);
```

Or make it dynamic based on video length:

```typescript
const [videoDuration, setVideoDuration] = useState(0);

// In VideoPlayer component
const handleLoadedMetadata = () => {
  if (videoRef.current) {
    setVideoDuration(videoRef.current.duration);
  }
};

// Use 80% of video duration as delay
const delayMs = Math.min(videoDuration * 0.8 * 1000, 10000); // Max 10 seconds
```

## 📱 Mobile Layout Customization

Edit `src/components/FormContainer.tsx` mobile section:

```typescript
{/* Mobile Layout - Adjust overlay positions */}
<div className="lg:hidden relative h-full">
  {/* Question - Adjust padding and position */}
  <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 to-transparent">
    <h2 className="text-3xl font-display font-bold text-white">
      {currentStep.question}
    </h2>
  </div>

  {/* Interaction - Adjust bottom position */}
  <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
    {renderStepContent()}
  </div>
</div>
```

## 📊 Custom Data Processing

### Add Custom Validation

Edit `src/components/ContactForm.tsx`:

```typescript
const validateField = (field: FormField, value: string): string => {
  // Custom phone validation for US numbers
  if (field.type === 'tel' && value) {
    const usPhoneRegex = /^\+1\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!usPhoneRegex.test(value)) {
      return 'Please enter a valid US phone number';
    }
  }
  
  // Add more custom validations...
  return '';
};
```

### Transform Data Before Submission

Edit `src/components/FormContainer.tsx`:

```typescript
const submitToBackend = async (finalData: FormData) => {
  // Transform or enrich data before submission
  const enrichedData = {
    ...finalData,
    // Add custom fields
    source: 'video-form',
    language: navigator.language,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    // Format phone numbers
    phone: formatPhoneNumber(finalData.phone),
  };

  // Continue with submission...
};
```

## 🔔 Email Notifications

Install nodemailer:
```bash
npm install nodemailer @types/nodemailer
```

Create `src/lib/email.ts`:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSubmissionEmail(data: any) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Form Submission',
    html: `
      <h2>New Submission Received</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `,
  });
}
```

Use in API route:

```typescript
// src/app/api/submit/route.ts
import { sendSubmissionEmail } from '@/lib/email';

// After saving to database
await sendSubmissionEmail(submission);
```

## 🌐 Internationalization

Create language files:

```typescript
// src/config/languages.ts
export const translations = {
  en: {
    continue: 'Continue',
    submit: 'Submit',
    required: 'This field is required',
  },
  fr: {
    continue: 'Continuer',
    submit: 'Soumettre',
    required: 'Ce champ est requis',
  },
  es: {
    continue: 'Continuar',
    submit: 'Enviar',
    required: 'Este campo es requerido',
  },
};
```

Use in components:

```typescript
import { translations } from '@/config/languages';

const lang = 'fr'; // Get from user preference or browser
const t = translations[lang];

<button>{t.continue}</button>
```

## 🎯 Analytics Integration

### Google Analytics

Install package:
```bash
npm install @next/third-parties
```

Add to layout:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

Track custom events:

```typescript
// In FormContainer
const handleStepComplete = (stepId: string) => {
  // @ts-ignore
  if (window.gtag) {
    window.gtag('event', 'step_complete', {
      step_id: stepId,
      step_number: currentStepIndex + 1,
    });
  }
};
```

## 🔒 Adding Authentication

For the admin page, add simple authentication:

```typescript
// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'your-secret-password') {
      localStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ... rest of admin page
}
```

---

For more advanced customizations, refer to the [Next.js documentation](https://nextjs.org/docs) and [TailwindCSS documentation](https://tailwindcss.com/docs).
