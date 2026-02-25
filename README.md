# Interactive Video Form Application

A stunning, cinematic single-page application that guides users through a multi-step video-based form experience. Built with Next.js 14, TypeScript, TailwindCSS, and MongoDB.

## ✨ Features

- **Responsive Design**: Split-screen desktop layout, full-screen overlay mobile layout
- **Interactive Video Player**: Autoplay muted → click to restart with sound
- **5-Second Delay**: Ensures users watch video prompts before advancing
- **Multiple Input Types**:
  - Multiple choice selections
  - Text inputs and textareas
  - Structured contact forms (name, email, phone)
- **Session Persistence**: Saves progress to sessionStorage
- **Google Calendar Integration**: Embedded appointment scheduling
- **MongoDB Storage**: Secure backend data persistence
- **Smooth Animations**: Framer Motion for delightful interactions

## 🎨 Design Philosophy

This application features a bold, cinematic aesthetic with:
- Elegant serif display font (Cormorant Garamond) paired with modern sans-serif (Outfit)
- Warm color palette with deep reds and amber accents
- Generous use of backdrop blur and layered transparency
- Thoughtful micro-interactions and staggered reveal animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud like MongoDB Atlas)

### Installation

1. **Clone and install dependencies**:
```bash
cd video-form-app
npm install
```

2. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/video-form-db
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-form-db

NEXT_PUBLIC_GOOGLE_CALENDAR_URL=https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID
```

3. **Configure your video URLs**:

Open `src/config/formSteps.ts` and replace the placeholder video URLs with your own:
```typescript
videoUrl: 'https://your-video-hosting.com/video1.mp4'
```

You can use:
- Your own hosted videos
- Vimeo URLs
- YouTube embed URLs
- Cloud storage (AWS S3, Cloudinary, etc.)

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
video-form-app/
├── src/
│   ├── app/
│   │   ├── api/submit/route.ts    # Form submission API
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   ├── CompletionScreen.tsx   # Success screen with calendar
│   │   ├── ContactForm.tsx        # Name/email/phone form
│   │   ├── ContinueButton.tsx     # Delayed continue button
│   │   ├── FormContainer.tsx      # Main form orchestrator
│   │   ├── MultipleChoice.tsx     # Multiple choice input
│   │   ├── TextInput.tsx          # Text/textarea input
│   │   └── VideoPlayer.tsx        # Custom video player
│   ├── config/
│   │   └── formSteps.ts           # Form flow configuration
│   ├── lib/
│   │   └── mongodb.ts             # MongoDB connection
│   └── types/
│       └── form.ts                # TypeScript types
├── .env.local.example             # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎬 Customizing the Form Flow

Edit `src/config/formSteps.ts` to customize your form:

```typescript
export const formSteps: FormStep[] = [
  {
    id: 'welcome',
    type: 'info',
    videoUrl: '/videos/welcome.mp4',
    question: 'Welcome to our form!',
  },
  {
    id: 'choice',
    type: 'multiple-choice',
    videoUrl: '/videos/question.mp4',
    question: 'What interests you?',
    fieldName: 'interest',
    options: [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
    ],
  },
  // Add more steps...
];
```

### Step Types

1. **info**: Shows video with a continue button (after 5 seconds)
2. **multiple-choice**: Radio button selection
3. **text-input**: Single line or textarea input
4. **form**: Structured form with multiple fields
5. **completion**: Success screen with calendar integration

## 🗄️ Database Schema

Submissions are stored in MongoDB with this structure:

```typescript
{
  _id: ObjectId,
  sessionId: string,
  submittedAt: Date,
  ipAddress: string,
  userAgent: string,
  
  // Your custom fields based on form configuration
  region: string,
  pseudo: string,
  story: string,
  name: string,
  email: string,
  phone: string,
}
```

## 🔌 API Endpoints

### POST `/api/submit`
Submit form data to MongoDB.

**Request Body**:
```json
{
  "region": "europe",
  "pseudo": "@username",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "sessionId": "session_xyz"
}
```

**Response**:
```json
{
  "success": true,
  "id": "mongodb_document_id",
  "message": "Form submitted successfully"
}
```

### GET `/api/submit`
Retrieve submissions (for admin purposes).

**Query Parameters**:
- `?sessionId=xyz` - Get specific submission
- No params - Get recent 50 submissions

## 📱 Google Calendar Setup

1. Go to [Google Calendar Settings](https://calendar.google.com/calendar/u/0/r/settings)
2. Navigate to "Appointment schedules"
3. Create a new appointment schedule
4. Copy the booking page URL
5. Add it to your `.env.local` as `NEXT_PUBLIC_GOOGLE_CALENDAR_URL`

## 🎨 Customizing Styles

The app uses TailwindCSS with custom theme configuration. Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#B91C1C', // Your brand color
    dark: '#7F1D1D',
    light: '#DC2626',
  },
  accent: {
    DEFAULT: '#F59E0B',
    light: '#FCD34D',
  },
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Build for production:
```bash
npm run build
npm start
```

## 🔒 Security Considerations

- Add rate limiting to `/api/submit` endpoint
- Implement CAPTCHA for bot protection
- Add input sanitization and validation
- Use environment variables for sensitive data
- Enable CORS restrictions in production

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or issues, please open a GitHub issue.

---

Built with ❤️ using Next.js, TypeScript, TailwindCSS, and MongoDB
