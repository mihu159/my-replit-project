# PostureTrack Pro - Complete Source Code Export

## Project Structure

```
PostureTrack-Pro/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── camera/
│   │   │   │   └── camera-feed.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── educational-content.tsx
│   │   │   │   ├── posture-analysis.tsx
│   │   │   │   ├── progress-ring.tsx
│   │   │   │   ├── quick-actions.tsx
│   │   │   │   ├── recent-feedback.tsx
│   │   │   │   ├── stats-cards.tsx
│   │   │   │   └── todays-exercises.tsx
│   │   │   ├── layout/
│   │   │   │   ├── mobile-nav.tsx
│   │   │   │   └── navigation.tsx
│   │   │   └── ui/ (shadcn/ui components)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCamera.ts
│   │   │   ├── usePostureDetection.ts (⭐ REPLACE FOR TEACHABLE MACHINE)
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── authUtils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── admin.tsx
│   │   │   ├── analysis.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── education.tsx
│   │   │   ├── landing.tsx
│   │   │   ├── mobile-exercise.tsx (Kindle Fire compatible)
│   │   │   ├── not-found.tsx
│   │   │   └── progress.tsx
│   │   ├── types/
│   │   │   └── fitness.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── db.ts
│   ├── index.ts
│   ├── replitAuth.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── tsconfig.json
```

## Key Files for Teachable Machine Integration

### 1. Main Detection Hook (⭐ PRIMARY FILE TO MODIFY)
**File**: `client/src/hooks/usePostureDetection.ts`

This is where you'll replace the simulated detection with your Teachable Machine model. See TEACHABLE_MACHINE_INTEGRATION.md for the complete replacement code.

### 2. Camera Interface
**File**: `client/src/hooks/useCamera.ts`

Handles camera permissions and video stream management. No changes needed for Teachable Machine integration.

### 3. UI Component
**File**: `client/src/components/camera/camera-feed.tsx`

The main camera interface component. You might want to add loading states for model initialization.

### 4. Type Definitions
**File**: `client/src/types/fitness.ts`

```typescript
export interface PostureAnalysis {
  shoulderAlignment: number;
  neckPosition: number;
  spineAlignment: number;
  overallScore: number;
  feedback: string;
  status: 'good' | 'warning' | 'error';
}
```

## Installation & Setup

### 1. Clone/Download the Code
```bash
git clone <your-repo-url>
cd PostureTrack-Pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add TensorFlow.js for Teachable Machine (when ready)
```bash
npm install @tensorflow/tfjs @tensorflow-models/posenet
```

### 4. Environment Setup
Create `.env` file:
```
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_id
REPLIT_DOMAINS=your_domain
```

### 5. Database Setup
```bash
npm run db:push
```

### 6. Start Development
```bash
npm run dev
```

## Teachable Machine Integration Steps

### Step 1: Train Your Model
1. Go to https://teachablemachine.withgoogle.com/
2. Choose "Pose Project"
3. Create classes like:
   - "Good Posture"
   - "Poor Posture"
   - "Slouching"
   - "Forward Head"
4. Take photos/videos for each class
5. Train the model
6. Export as "TensorFlow.js"

### Step 2: Add Model Files
Place exported files in:
```
public/
  models/
    model.json
    weights.bin
    metadata.json
```

### Step 3: Replace Detection Logic
Replace the content of `client/src/hooks/usePostureDetection.ts` with the code from TEACHABLE_MACHINE_INTEGRATION.md

### Step 4: Update Dependencies
```bash
npm install @tensorflow/tfjs
```

### Step 5: Test Integration
1. Start the app: `npm run dev`
2. Go to Analysis page
3. Allow camera permissions
4. Start posture analysis
5. Test with different poses

## Device Compatibility

### Full Features (Camera + AI)
- Desktop browsers (Chrome, Firefox, Safari)
- Mobile phones with camera
- Tablets with camera access

### Limited Features (Exercises Only)
- Kindle Fire tablets (`/mobile-exercise` page)
- Devices without camera
- Browsers with restricted camera access

### Not Compatible
- Kindle E-readers (limited browser)
- Very old browsers without WebRTC

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Start login flow
- `GET /api/logout` - Logout user

### User Data
- `GET /api/stats` - User statistics
- `GET /api/progress` - Progress tracking
- `GET /api/feedback` - User feedback

### Exercises
- `GET /api/exercises` - All exercises
- `GET /api/user-exercises/today` - Today's exercises
- `POST /api/user-exercises` - Create user exercise
- `PUT /api/user-exercises/:id` - Update exercise status

### Content Management (Admin)
- `GET /api/educational-content` - Educational content
- `POST /api/exercises` - Create exercise (admin only)
- `POST /api/educational-content` - Create content (admin only)

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables Needed
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Session encryption
- `REPL_ID` - Replit authentication
- `REPLIT_DOMAINS` - Allowed domains

## Customization Options

### 1. Change AI Model Sensitivity
In `usePostureDetection.ts`, adjust thresholds:
```typescript
if (overallScore >= 85) {  // Change this value
  status = 'good';
} else if (overallScore >= 70) {  // And this value
  status = 'warning';
} else {
  status = 'error';
}
```

### 2. Add New Exercise Categories
Update `shared/schema.ts`:
```typescript
category: varchar("category").notNull(), // Add new categories here
```

### 3. Customize UI Colors
Edit `client/src/index.css`:
```css
:root {
  --primary: hsl(217, 91%, 60%);     /* Main blue */
  --secondary: hsl(153, 60%, 53%);   /* Green */
  --accent: hsl(37, 91%, 55%);       /* Orange */
}
```

### 4. Add New User Roles
Update user role checks in `server/routes.ts` and add new permissions.

## Security Features

- Session-based authentication with PostgreSQL storage
- CSRF protection via secure cookies
- Role-based access control (user/admin)
- Input validation with Zod schemas
- Secure file uploads for model files

## Performance Optimization

- React Query for efficient data fetching
- Lazy loading of heavy components
- Optimized camera feed handling
- Progressive Web App features
- Mobile-first responsive design

## Troubleshooting

### Camera Not Working
1. Check browser permissions
2. Ensure HTTPS connection
3. Try different browsers
4. Check console for errors

### Model Not Loading
1. Verify model files in `/public/models/`
2. Check browser developer tools
3. Ensure TensorFlow.js is installed
4. Check model file paths

### Database Issues
1. Verify DATABASE_URL environment variable
2. Run `npm run db:push` to sync schema
3. Check PostgreSQL connection

### Build Errors
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check TypeScript errors: `npm run type-check`

## Support & Documentation

- **Teachable Machine**: https://teachablemachine.withgoogle.com/
- **TensorFlow.js**: https://www.tensorflow.org/js
- **React Query**: https://tanstack.com/query/
- **Tailwind CSS**: https://tailwindcss.com/
- **Drizzle ORM**: https://orm.drizzle.team/

## License

This code is provided as-is for educational and commercial use. Modify as needed for your specific requirements.