var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  educationalContent: () => educationalContent,
  exercises: () => exercises,
  feedback: () => feedback,
  insertEducationalContentSchema: () => insertEducationalContentSchema,
  insertExerciseSchema: () => insertExerciseSchema,
  insertFeedbackSchema: () => insertFeedbackSchema,
  insertPostureSessionSchema: () => insertPostureSessionSchema,
  insertProgressTrackingSchema: () => insertProgressTrackingSchema,
  insertReminderSchema: () => insertReminderSchema,
  insertUserExerciseSchema: () => insertUserExerciseSchema,
  postureSessions: () => postureSessions,
  progressTracking: () => progressTracking,
  reminders: () => reminders,
  sessions: () => sessions,
  upsertUserSchema: () => upsertUserSchema,
  userExercises: () => userExercises,
  users: () => users
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  // 'user' | 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var postureSessions = pgTable("posture_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"),
  // in seconds
  avgPostureScore: real("avg_posture_score"),
  shoulderAlignment: real("shoulder_alignment"),
  neckPosition: real("neck_position"),
  spineAlignment: real("spine_alignment"),
  correctionCount: integer("correction_count").default(0),
  status: varchar("status").default("active"),
  // 'active' | 'completed' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow()
});
var exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration"),
  // in minutes
  difficulty: varchar("difficulty").notNull(),
  // 'beginner' | 'intermediate' | 'advanced'
  category: varchar("category").notNull(),
  // 'posture' | 'strength' | 'flexibility'
  instructions: text("instructions"),
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  status: varchar("status").default("scheduled"),
  // 'scheduled' | 'in_progress' | 'completed' | 'skipped'
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var progressTracking = pgTable("progress_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  weeklyScore: real("weekly_score"),
  sessionsCompleted: integer("sessions_completed").default(0),
  totalCorrections: integer("total_corrections").default(0),
  streakDays: integer("streak_days").default(0),
  improvementPercentage: real("improvement_percentage")
});
var feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: integer("session_id").references(() => postureSessions.id),
  type: varchar("type").notNull(),
  // 'correction' | 'achievement' | 'tip'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity").default("info"),
  // 'info' | 'warning' | 'success' | 'error'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  contentType: varchar("content_type").notNull(),
  // 'article' | 'video' | 'exercise'
  category: varchar("category").notNull(),
  // 'posture' | 'ergonomics' | 'exercises'
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  readTime: integer("read_time"),
  // in minutes
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message"),
  frequency: varchar("frequency").notNull(),
  // 'once' | 'daily' | 'weekly' | 'custom'
  scheduledTime: timestamp("scheduled_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var upsertUserSchema = createInsertSchema(users);
var insertPostureSessionSchema = createInsertSchema(postureSessions).omit({
  id: true,
  createdAt: true
});
var insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true
});
var insertUserExerciseSchema = createInsertSchema(userExercises).omit({
  id: true,
  createdAt: true
});
var insertProgressTrackingSchema = createInsertSchema(progressTracking).omit({
  id: true
});
var insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true
});
var insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
  createdAt: true
});
var insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, gte, lte, count, sum } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Posture session operations
  async createPostureSession(session2) {
    const [result] = await db.insert(postureSessions).values(session2).returning();
    return result;
  }
  async updatePostureSession(id, updates) {
    const [result] = await db.update(postureSessions).set(updates).where(eq(postureSessions.id, id)).returning();
    return result;
  }
  async getUserPostureSessions(userId, limit = 10) {
    return await db.select().from(postureSessions).where(eq(postureSessions.userId, userId)).orderBy(desc(postureSessions.createdAt)).limit(limit);
  }
  async getActivePostureSession(userId) {
    const [session2] = await db.select().from(postureSessions).where(and(eq(postureSessions.userId, userId), eq(postureSessions.status, "active")));
    return session2;
  }
  // Exercise operations
  async getAllExercises() {
    return await db.select().from(exercises).where(eq(exercises.isActive, true)).orderBy(exercises.name);
  }
  async getExercisesByCategory(category) {
    return await db.select().from(exercises).where(and(eq(exercises.category, category), eq(exercises.isActive, true))).orderBy(exercises.name);
  }
  async createExercise(exercise) {
    const [result] = await db.insert(exercises).values(exercise).returning();
    return result;
  }
  async updateExercise(id, updates) {
    const [result] = await db.update(exercises).set(updates).where(eq(exercises.id, id)).returning();
    return result;
  }
  // User exercise operations
  async createUserExercise(userExercise) {
    const [result] = await db.insert(userExercises).values(userExercise).returning();
    return result;
  }
  async updateUserExercise(id, updates) {
    const [result] = await db.update(userExercises).set(updates).where(eq(userExercises.id, id)).returning();
    return result;
  }
  async getUserExercisesToday(userId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return await db.select({
      id: userExercises.id,
      userId: userExercises.userId,
      exerciseId: userExercises.exerciseId,
      status: userExercises.status,
      startTime: userExercises.startTime,
      endTime: userExercises.endTime,
      notes: userExercises.notes,
      createdAt: userExercises.createdAt,
      exercise: exercises
    }).from(userExercises).leftJoin(exercises, eq(userExercises.exerciseId, exercises.id)).where(
      and(
        eq(userExercises.userId, userId),
        gte(userExercises.createdAt, today),
        lte(userExercises.createdAt, tomorrow)
      )
    ).orderBy(userExercises.createdAt);
  }
  async getUserExerciseHistory(userId, limit = 20) {
    return await db.select().from(userExercises).where(eq(userExercises.userId, userId)).orderBy(desc(userExercises.createdAt)).limit(limit);
  }
  // Progress tracking operations
  async getUserProgress(userId) {
    const [progress] = await db.select().from(progressTracking).where(eq(progressTracking.userId, userId)).orderBy(desc(progressTracking.date)).limit(1);
    return progress;
  }
  async upsertUserProgress(progress) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const [existing] = await db.select().from(progressTracking).where(and(eq(progressTracking.userId, progress.userId), gte(progressTracking.date, today)));
    if (existing) {
      const [result] = await db.update(progressTracking).set(progress).where(eq(progressTracking.id, existing.id)).returning();
      return result;
    } else {
      const [result] = await db.insert(progressTracking).values(progress).returning();
      return result;
    }
  }
  async getUserProgressHistory(userId, days = 30) {
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - days);
    return await db.select().from(progressTracking).where(and(eq(progressTracking.userId, userId), gte(progressTracking.date, startDate))).orderBy(desc(progressTracking.date));
  }
  async getUserStats(userId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [sessionsToday] = await db.select({ count: count() }).from(postureSessions).where(
      and(
        eq(postureSessions.userId, userId),
        gte(postureSessions.createdAt, today),
        lte(postureSessions.createdAt, tomorrow)
      )
    );
    const [latestProgress] = await db.select().from(progressTracking).where(eq(progressTracking.userId, userId)).orderBy(desc(progressTracking.date)).limit(1);
    const [totalCorrections] = await db.select({ total: sum(postureSessions.correctionCount) }).from(postureSessions).where(eq(postureSessions.userId, userId));
    return {
      weeklyProgress: latestProgress?.weeklyScore || 0,
      sessionsToday: sessionsToday.count,
      streakDays: latestProgress?.streakDays || 0,
      totalCorrections: Number(totalCorrections.total) || 0
    };
  }
  // Feedback operations
  async createFeedback(feedbackData) {
    const [result] = await db.insert(feedback).values(feedbackData).returning();
    return result;
  }
  async getUserFeedback(userId, limit = 10) {
    return await db.select().from(feedback).where(eq(feedback.userId, userId)).orderBy(desc(feedback.createdAt)).limit(limit);
  }
  async markFeedbackAsRead(feedbackId) {
    await db.update(feedback).set({ isRead: true }).where(eq(feedback.id, feedbackId));
  }
  // Educational content operations
  async getAllEducationalContent() {
    return await db.select().from(educationalContent).where(eq(educationalContent.isPublished, true)).orderBy(desc(educationalContent.createdAt));
  }
  async getEducationalContentByCategory(category) {
    return await db.select().from(educationalContent).where(and(eq(educationalContent.category, category), eq(educationalContent.isPublished, true))).orderBy(desc(educationalContent.createdAt));
  }
  async createEducationalContent(content) {
    const [result] = await db.insert(educationalContent).values(content).returning();
    return result;
  }
  // Reminder operations
  async createReminder(reminder) {
    const [result] = await db.insert(reminders).values(reminder).returning();
    return result;
  }
  async getUserReminders(userId) {
    return await db.select().from(reminders).where(and(eq(reminders.userId, userId), eq(reminders.isActive, true))).orderBy(reminders.scheduledTime);
  }
  async updateReminder(id, updates) {
    const [result] = await db.update(reminders).set(updates).where(eq(reminders.id, id)).returning();
    return result;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.post("/api/posture-sessions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertPostureSessionSchema.parse({
        ...req.body,
        userId
      });
      const session2 = await storage.createPostureSession(sessionData);
      res.json(session2);
    } catch (error) {
      console.error("Error creating posture session:", error);
      res.status(500).json({ message: "Failed to create posture session" });
    }
  });
  app2.put("/api/posture-sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      const session2 = await storage.updatePostureSession(sessionId, updates);
      res.json(session2);
    } catch (error) {
      console.error("Error updating posture session:", error);
      res.status(500).json({ message: "Failed to update posture session" });
    }
  });
  app2.get("/api/posture-sessions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions2 = await storage.getUserPostureSessions(userId);
      res.json(sessions2);
    } catch (error) {
      console.error("Error fetching posture sessions:", error);
      res.status(500).json({ message: "Failed to fetch posture sessions" });
    }
  });
  app2.get("/api/posture-sessions/active", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const session2 = await storage.getActivePostureSession(userId);
      res.json(session2);
    } catch (error) {
      console.error("Error fetching active session:", error);
      res.status(500).json({ message: "Failed to fetch active session" });
    }
  });
  app2.get("/api/exercises", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category;
      const exercises2 = category ? await storage.getExercisesByCategory(category) : await storage.getAllExercises();
      res.json(exercises2);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });
  app2.post("/api/exercises", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });
  app2.get("/api/user-exercises/today", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const exercises2 = await storage.getUserExercisesToday(userId);
      res.json(exercises2);
    } catch (error) {
      console.error("Error fetching today's exercises:", error);
      res.status(500).json({ message: "Failed to fetch today's exercises" });
    }
  });
  app2.post("/api/user-exercises", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const exerciseData = insertUserExerciseSchema.parse({
        ...req.body,
        userId
      });
      const userExercise = await storage.createUserExercise(exerciseData);
      res.json(userExercise);
    } catch (error) {
      console.error("Error creating user exercise:", error);
      res.status(500).json({ message: "Failed to create user exercise" });
    }
  });
  app2.put("/api/user-exercises/:id", isAuthenticated, async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const updates = req.body;
      const userExercise = await storage.updateUserExercise(exerciseId, updates);
      res.json(userExercise);
    } catch (error) {
      console.error("Error updating user exercise:", error);
      res.status(500).json({ message: "Failed to update user exercise" });
    }
  });
  app2.get("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });
  app2.get("/api/progress/history", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days) || 30;
      const history = await storage.getUserProgressHistory(userId, days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching progress history:", error);
      res.status(500).json({ message: "Failed to fetch progress history" });
    }
  });
  app2.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertProgressTrackingSchema.parse({
        ...req.body,
        userId
      });
      const progress = await storage.upsertUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  app2.get("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedbackList = await storage.getUserFeedback(userId);
      res.json(feedbackList);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });
  app2.post("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId
      });
      const feedbackItem = await storage.createFeedback(feedbackData);
      res.json(feedbackItem);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });
  app2.put("/api/feedback/:id/read", isAuthenticated, async (req, res) => {
    try {
      const feedbackId = parseInt(req.params.id);
      await storage.markFeedbackAsRead(feedbackId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      res.status(500).json({ message: "Failed to mark feedback as read" });
    }
  });
  app2.get("/api/educational-content", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category;
      const content = category ? await storage.getEducationalContentByCategory(category) : await storage.getAllEducationalContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching educational content:", error);
      res.status(500).json({ message: "Failed to fetch educational content" });
    }
  });
  app2.post("/api/educational-content", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const contentData = insertEducationalContentSchema.parse(req.body);
      const content = await storage.createEducationalContent(contentData);
      res.json(content);
    } catch (error) {
      console.error("Error creating educational content:", error);
      res.status(500).json({ message: "Failed to create educational content" });
    }
  });
  app2.get("/api/reminders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders2 = await storage.getUserReminders(userId);
      res.json(reminders2);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });
  app2.post("/api/reminders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminderData = insertReminderSchema.parse({
        ...req.body,
        userId
      });
      const reminder = await storage.createReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
