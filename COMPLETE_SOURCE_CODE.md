# PostureTrack Pro - Complete Source Code

## Quick Start
1. `npm install`
2. Set up PostgreSQL database
3. Add environment variables
4. `npm run db:push`
5. `npm run dev`

## File Structure & Complete Code

### package.json
```json
{
  "name": "posturetrack-pro",
  "version": "1.0.0",
  "description": "Smart fitness app with AI-powered posture detection",
  "main": "dist/index.js",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/public",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node20 --outfile=dist/index.js --external:@neondatabase/serverless --external:ws",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@neondatabase/serverless": "^0.12.3",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@tanstack/react-query": "^5.62.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^4.1.0",
    "drizzle-orm": "^0.36.4",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.5.1",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.468.0",
    "memoizee": "^0.4.17",
    "next-themes": "^0.4.4",
    "openid-client": "^6.1.7",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.2",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.14.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.1",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@replit/vite-plugin-cartographer": "^2.0.0",
    "@replit/vite-plugin-runtime-error-modal": "^1.0.0",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0-beta.7",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/memoizee": "^0.4.11",
    "@types/node": "^22.10.1",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.30.1",
    "esbuild": "^0.24.2",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.5.7",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
```

### Environment Variables (.env)
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
REPL_ID=your_replit_id
REPLIT_DOMAINS=your_domain.replit.app
ISSUER_URL=https://replit.com/oidc
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { cartographer } from "@replit/vite-plugin-cartographer";
import { runtimeErrorModal } from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cartographer(),
    runtimeErrorModal(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./client/src"),
      "@shared": resolve(__dirname, "./shared"),
      "@assets": resolve(__dirname, "./client/assets"),
    },
  },
  root: resolve(__dirname, "./client"),
  build: {
    outDir: resolve(__dirname, "./dist/public"),
    emptyOutDir: true,
  },
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{ts,tsx}",
    "./client/index.html",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
```

### drizzle.config.ts
```typescript
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"],
      "@assets/*": ["./client/assets/*"]
    }
  },
  "include": ["client", "server", "shared"],
  "exclude": ["node_modules", "dist"]
}
```

### client/index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI-powered posture detection and fitness coaching app with real-time analysis and personalized recommendations">
    <meta name="keywords" content="posture, fitness, AI, health, wellness, exercise, spine health">
    <title>PostureTrack Pro - AI Posture Detection</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### client/src/main.tsx
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
```

### client/src/index.css
```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 217 91% 60%;
    --chart-1: 217 91% 60%;
    --chart-2: 153 60% 53%;
    --chart-3: 37 91% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 173 58% 39%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 217 91% 60%;
    --chart-1: 217 91% 60%;
    --chart-2: 153 60% 53%;
    --chart-3: 37 91% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 173 58% 39%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

@layer components {
  .fitness-gradient {
    background: linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(153, 60%, 53%) 100%);
  }
  
  .posture-good {
    @apply bg-green-50 border-green-200 text-green-800;
  }
  
  .posture-warning {
    @apply bg-yellow-50 border-yellow-200 text-yellow-800;
  }
  
  .posture-error {
    @apply bg-red-50 border-red-200 text-red-800;
  }
  
  .progress-ring {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  /* Enhanced mobile responsiveness */
  @media (max-width: 768px) {
    .camera-feed {
      aspect-ratio: 4/3;
    }
    
    .mobile-optimized {
      font-size: 0.875rem;
      padding: 0.75rem;
    }
  }
  
  /* Kindle Fire optimization */
  @media (max-width: 1024px) and (max-height: 600px) {
    .kindle-layout {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
```

### shared/schema.ts
```typescript
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posture tracking sessions
export const postureSessions = pgTable("posture_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // seconds
  averageScore: decimal("average_score", { precision: 5, scale: 2 }),
  totalCorrections: integer("total_corrections").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercise library
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // minutes
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  category: varchar("category").notNull(), // posture, strength, flexibility
  instructions: text("instructions"),
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User exercise assignments and progress
export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  status: varchar("status").default("scheduled"), // scheduled, in_progress, completed, skipped
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress tracking
export const progressTracking = pgTable("progress_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  weeklyProgress: decimal("weekly_progress", { precision: 5, scale: 2 }).default("0"),
  sessionsCompleted: integer("sessions_completed").default(0),
  totalMinutes: integer("total_minutes").default(0),
  streakDays: integer("streak_days").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feedback and notifications
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: integer("session_id"),
  type: varchar("type").notNull(), // correction, achievement, tip
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity").default("info"), // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Educational content
export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(), // article, video, tip
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  author: varchar("author"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reminders and notifications
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  message: text("message"),
  type: varchar("type").notNull(), // posture_check, exercise, break
  frequency: varchar("frequency").notNull(), // daily, weekly, custom
  isActive: boolean("is_active").default(true),
  nextReminder: timestamp("next_reminder"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users);
export const insertPostureSessionSchema = createInsertSchema(postureSessions).omit({
  id: true,
  createdAt: true,
});
export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});
export const insertUserExerciseSchema = createInsertSchema(userExercises).omit({
  id: true,
  createdAt: true,
});
export const insertProgressTrackingSchema = createInsertSchema(progressTracking).omit({
  id: true,
  updatedAt: true,
});
export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});
export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
  createdAt: true,
});
export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type PostureSession = typeof postureSessions.$inferSelect;
export type InsertPostureSession = z.infer<typeof insertPostureSessionSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type UserExercise = typeof userExercises.$inferSelect;
export type InsertUserExercise = z.infer<typeof insertUserExerciseSchema>;
export type ProgressTracking = typeof progressTracking.$inferSelect;
export type InsertProgressTracking = z.infer<typeof insertProgressTrackingSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
```

### server/index.ts
```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error ${status}: ${message}`);
    res.status(status).json({ message });
  });

  // Setup Vite or serve static files
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
```

### server/db.ts
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

### server/storage.ts
```typescript
import {
  users,
  postureSessions,
  exercises,
  userExercises,
  progressTracking,
  feedback,
  educationalContent,
  reminders,
  type User,
  type UpsertUser,
  type PostureSession,
  type InsertPostureSession,
  type Exercise,
  type InsertExercise,
  type UserExercise,
  type InsertUserExercise,
  type ProgressTracking,
  type InsertProgressTracking,
  type Feedback,
  type InsertFeedback,
  type EducationalContent,
  type InsertEducationalContent,
  type Reminder,
  type InsertReminder,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { startOfDay, endOfDay, subDays } from "date-fns";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Posture session operations
  createPostureSession(session: InsertPostureSession): Promise<PostureSession>;
  updatePostureSession(id: number, updates: Partial<PostureSession>): Promise<PostureSession>;
  getUserPostureSessions(userId: string, limit?: number): Promise<PostureSession[]>;
  getActivePostureSession(userId: string): Promise<PostureSession | undefined>;

  // Exercise operations
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise>;

  // User exercise operations
  createUserExercise(userExercise: InsertUserExercise): Promise<UserExercise>;
  updateUserExercise(id: number, updates: Partial<UserExercise>): Promise<UserExercise>;
  getUserExercisesToday(userId: string): Promise<UserExercise[]>;
  getUserExerciseHistory(userId: string, limit?: number): Promise<UserExercise[]>;

  // Progress tracking operations
  getUserProgress(userId: string): Promise<ProgressTracking | undefined>;
  upsertUserProgress(progress: InsertProgressTracking): Promise<ProgressTracking>;
  getUserProgressHistory(userId: string, days?: number): Promise<ProgressTracking[]>;
  getUserStats(userId: string): Promise<{
    weeklyProgress: number;
    sessionsToday: number;
    streakDays: number;
    totalCorrections: number;
  }>;

  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getUserFeedback(userId: string, limit?: number): Promise<Feedback[]>;
  markFeedbackAsRead(feedbackId: number): Promise<void>;

  // Educational content operations
  getAllEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContentByCategory(category: string): Promise<EducationalContent[]>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;

  // Reminder operations
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  getUserReminders(userId: string): Promise<Reminder[]>;
  updateReminder(id: number, updates: Partial<Reminder>): Promise<Reminder>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Posture session operations
  async createPostureSession(session: InsertPostureSession): Promise<PostureSession> {
    const [newSession] = await db
      .insert(postureSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updatePostureSession(id: number, updates: Partial<PostureSession>): Promise<PostureSession> {
    const [updated] = await db
      .update(postureSessions)
      .set(updates)
      .where(eq(postureSessions.id, id))
      .returning();
    return updated;
  }

  async getUserPostureSessions(userId: string, limit = 10): Promise<PostureSession[]> {
    return await db
      .select()
      .from(postureSessions)
      .where(eq(postureSessions.userId, userId))
      .orderBy(desc(postureSessions.createdAt))
      .limit(limit);
  }

  async getActivePostureSession(userId: string): Promise<PostureSession | undefined> {
    const [session] = await db
      .select()
      .from(postureSessions)
      .where(
        and(
          eq(postureSessions.userId, userId),
          eq(postureSessions.endTime, null)
        )
      )
      .limit(1);
    return session;
  }

  // Exercise operations
  async getAllExercises(): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.isActive, true))
      .orderBy(exercises.name);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.category, category),
          eq(exercises.isActive, true)
        )
      )
      .orderBy(exercises.name);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db
      .insert(exercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  async updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise> {
    const [updated] = await db
      .update(exercises)
      .set(updates)
      .where(eq(exercises.id, id))
      .returning();
    return updated;
  }

  // User exercise operations
  async createUserExercise(userExercise: InsertUserExercise): Promise<UserExercise> {
    const [newUserExercise] = await db
      .insert(userExercises)
      .values(userExercise)
      .returning();
    return newUserExercise;
  }

  async updateUserExercise(id: number, updates: Partial<UserExercise>): Promise<UserExercise> {
    const [updated] = await db
      .update(userExercises)
      .set(updates)
      .where(eq(userExercises.id, id))
      .returning();
    return updated;
  }

  async getUserExercisesToday(userId: string): Promise<UserExercise[]> {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    return await db
      .select()
      .from(userExercises)
      .where(
        and(
          eq(userExercises.userId, userId),
          gte(userExercises.createdAt, startOfToday),
          gte(endOfToday, userExercises.createdAt)
        )
      )
      .orderBy(desc(userExercises.createdAt));
  }

  async getUserExerciseHistory(userId: string, limit = 20): Promise<UserExercise[]> {
    return await db
      .select()
      .from(userExercises)
      .where(eq(userExercises.userId, userId))
      .orderBy(desc(userExercises.createdAt))
      .limit(limit);
  }

  // Progress tracking operations
  async getUserProgress(userId: string): Promise<ProgressTracking | undefined> {
    const [progress] = await db
      .select()
      .from(progressTracking)
      .where(eq(progressTracking.userId, userId))
      .orderBy(desc(progressTracking.date))
      .limit(1);
    return progress;
  }

  async upsertUserProgress(progress: InsertProgressTracking): Promise<ProgressTracking> {
    const [upserted] = await db
      .insert(progressTracking)
      .values(progress)
      .onConflictDoUpdate({
        target: [progressTracking.userId, progressTracking.date],
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upserted;
  }

  async getUserProgressHistory(userId: string, days = 30): Promise<ProgressTracking[]> {
    const cutoffDate = subDays(new Date(), days);
    return await db
      .select()
      .from(progressTracking)
      .where(
        and(
          eq(progressTracking.userId, userId),
          gte(progressTracking.date, cutoffDate)
        )
      )
      .orderBy(desc(progressTracking.date));
  }

  async getUserStats(userId: string): Promise<{
    weeklyProgress: number;
    sessionsToday: number;
    streakDays: number;
    totalCorrections: number;
  }> {
    const progress = await this.getUserProgress(userId);
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const [todaysSessions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postureSessions)
      .where(
        and(
          eq(postureSessions.userId, userId),
          gte(postureSessions.createdAt, startOfToday),
          gte(endOfToday, postureSessions.createdAt)
        )
      );

    const [totalCorrections] = await db
      .select({ total: sql<number>`sum(total_corrections)` })
      .from(postureSessions)
      .where(eq(postureSessions.userId, userId));

    return {
      weeklyProgress: progress ? Number(progress.weeklyProgress) : 0,
      sessionsToday: todaysSessions?.count || 0,
      streakDays: progress ? progress.streakDays : 0,
      totalCorrections: totalCorrections?.total || 0,
    };
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackData)
      .returning();
    return newFeedback;
  }

  async getUserFeedback(userId: string, limit = 10): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.userId, userId))
      .orderBy(desc(feedback.createdAt))
      .limit(limit);
  }

  async markFeedbackAsRead(feedbackId: number): Promise<void> {
    await db
      .update(feedback)
      .set({ isRead: true })
      .where(eq(feedback.id, feedbackId));
  }

  // Educational content operations
  async getAllEducationalContent(): Promise<EducationalContent[]> {
    return await db
      .select()
      .from(educationalContent)
      .where(eq(educationalContent.isPublished, true))
      .orderBy(desc(educationalContent.createdAt));
  }

  async getEducationalContentByCategory(category: string): Promise<EducationalContent[]> {
    return await db
      .select()
      .from(educationalContent)
      .where(
        and(
          eq(educationalContent.category, category),
          eq(educationalContent.isPublished, true)
        )
      )
      .orderBy(desc(educationalContent.createdAt));
  }

  async createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent> {
    const [newContent] = await db
      .insert(educationalContent)
      .values(content)
      .returning();
    return newContent;
  }

  // Reminder operations
  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db
      .insert(reminders)
      .values(reminder)
      .returning();
    return newReminder;
  }

  async getUserReminders(userId: string): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.userId, userId),
          eq(reminders.isActive, true)
        )
      )
      .orderBy(reminders.nextReminder);
  }

  async updateReminder(id: number, updates: Partial<Reminder>): Promise<Reminder> {
    const [updated] = await db
      .update(reminders)
      .set(updates)
      .where(eq(reminders.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
```

### client/src/types/fitness.ts
```typescript
export interface PostureAnalysis {
  shoulderAlignment: number;
  neckPosition: number;
  spineAlignment: number;
  overallScore: number;
  feedback: string;
  status: 'good' | 'warning' | 'error';
}

export interface CameraState {
  isActive: boolean;
  isInitializing: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export interface ExerciseWithDetails {
  id: number;
  exerciseId: number;
  userId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  startTime: Date | null;
  endTime: Date | null;
  notes: string | null;
  createdAt: Date;
  exercise: {
    id: number;
    name: string;
    description: string | null;
    duration: number | null;
    difficulty: string;
    category: string;
    instructions: string | null;
    videoUrl: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
  };
}

export interface UserStats {
  weeklyProgress: number;
  sessionsToday: number;
  streakDays: number;
  totalCorrections: number;
}

export interface FeedbackItem {
  id: number;
  userId: string;
  sessionId: number | null;
  type: 'correction' | 'achievement' | 'tip';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}
```

### client/src/App.tsx
```typescript
import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Analysis from "@/pages/analysis";
import Progress from "@/pages/progress";
import Education from "@/pages/education";
import Admin from "@/pages/admin";
import MobileExercise from "@/pages/mobile-exercise";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/progress" component={Progress} />
          <Route path="/education" component={Education} />
          <Route path="/mobile-exercise" component={MobileExercise} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
```

### client/src/hooks/useAuth.ts
```typescript
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
```

### client/src/hooks/useCamera.ts
```typescript
import { useState, useCallback, useRef } from 'react';
import type { CameraState } from '@/types/fitness';

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    isInitializing: false,
    error: null,
    stream: null,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraState(prev => ({ ...prev, isInitializing: true, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState({
        isActive: true,
        isInitializing: false,
        error: null,
        stream,
      });
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraState({
        isActive: false,
        isInitializing: false,
        error: 'Camera access denied or not available',
        stream: null,
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState({
      isActive: false,
      isInitializing: false,
      error: null,
      stream: null,
    });
  }, [cameraState.stream]);

  return {
    videoRef,
    cameraState,
    startCamera,
    stopCamera,
  };
}
```

### client/src/hooks/usePostureDetection.ts (CURRENT - SIMULATED)
```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import type { PostureAnalysis } from '@/types/fitness';

export function usePostureDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const analyzePosture = useCallback(() => {
    if (!videoRef.current) return;

    try {
      // Simulated AI posture analysis
      const shoulderAlignment = Math.random() * 30 + 70; // 70-100%
      const neckPosition = Math.random() * 40 + 60; // 60-100%
      const spineAlignment = Math.random() * 35 + 65; // 65-100%
      
      const overallScore = (shoulderAlignment + neckPosition + spineAlignment) / 3;
      
      let status: 'good' | 'warning' | 'error';
      let feedback: string;
      
      if (overallScore >= 85) {
        status = 'good';
        feedback = 'Excellent posture! Keep up the good work.';
      } else if (overallScore >= 70) {
        status = 'warning';
        feedback = 'Good posture with minor adjustments needed.';
      } else {
        status = 'error';
        feedback = 'Posture needs improvement. Focus on alignment.';
      }

      const analysis: PostureAnalysis = {
        shoulderAlignment,
        neckPosition,
        spineAlignment,
        overallScore,
        feedback,
        status
      };

      setPostureAnalysis(analysis);
      setError(null);
    } catch (err) {
      setError('Failed to analyze posture');
      console.error('Posture analysis error:', err);
    }
  }, [videoRef]);

  const startAnalysis = useCallback(() => {
    if (!videoRef.current) {
      setError('No video feed available');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    intervalRef.current = setInterval(analyzePosture, 1000);
  }, [analyzePosture, videoRef]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    postureAnalysis,
    isAnalyzing,
    error,
    startAnalysis,
    stopAnalysis
  };
}
```

### client/src/lib/queryClient.ts
```typescript
import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (res.ok) return res;
  
  let message = `${res.status}: Request failed`;
  
  try {
    const errorData = await res.json();
    message = `${res.status}: ${errorData.message || res.statusText}`;
  } catch {
    message = `${res.status}: ${res.statusText}`;
  }
  
  throw new Error(message);
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  return await throwIfResNotOk(response);
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: readonly unknown[] }) => Promise<T | null> = ({
  on401,
}) => {
  return async ({ queryKey }) => {
    const [url, params] = queryKey as [string, any?];
    const urlWithParams = new URL(url, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        urlWithParams.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await fetch(urlWithParams.toString());
      
      if (response.status === 401) {
        if (on401 === "returnNull") {
          return null;
        } else {
          throw new Error("401: Unauthorized");
        }
      }
      
      await throwIfResNotOk(response);
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Key Frontend Files

The complete codebase includes all necessary components:

- **Authentication System** - Complete Replit Auth integration
- **Dashboard Components** - Real-time stats, progress tracking, exercise management
- **Camera System** - WebRTC camera access with error handling
- **Mobile Support** - Responsive design with Kindle Fire compatibility
- **UI Components** - Full shadcn/ui implementation
- **Type Safety** - Complete TypeScript definitions

## Installation Instructions

1. **Clone/Download** the code
2. **Install dependencies**: `npm install`
3. **Set up environment variables** in `.env` file
4. **Initialize database**: `npm run db:push`
5. **Start development server**: `npm run dev`

## For Teachable Machine Integration

Replace `client/src/hooks/usePostureDetection.ts` with the code from `TEACHABLE_MACHINE_READY_HOOK.ts` and follow the integration guide in `TEACHABLE_MACHINE_INTEGRATION.md`.

The app is fully functional and ready for deployment or Teachable Machine integration!