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
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posture sessions table
export const postureSessions = pgTable("posture_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  avgPostureScore: real("avg_posture_score"),
  shoulderAlignment: real("shoulder_alignment"),
  neckPosition: real("neck_position"),
  spineAlignment: real("spine_alignment"),
  correctionCount: integer("correction_count").default(0),
  status: varchar("status").default("active"), // 'active' | 'completed' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercises table
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
  difficulty: varchar("difficulty").notNull(), // 'beginner' | 'intermediate' | 'advanced'
  category: varchar("category").notNull(), // 'posture' | 'strength' | 'flexibility'
  instructions: text("instructions"),
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User exercise sessions
export const userExercises = pgTable("user_exercises", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  status: varchar("status").default("scheduled"), // 'scheduled' | 'in_progress' | 'completed' | 'skipped'
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress tracking
export const progressTracking = pgTable("progress_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  weeklyScore: real("weekly_score"),
  sessionsCompleted: integer("sessions_completed").default(0),
  totalCorrections: integer("total_corrections").default(0),
  streakDays: integer("streak_days").default(0),
  improvementPercentage: real("improvement_percentage"),
});

// Feedback and corrections
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: integer("session_id").references(() => postureSessions.id),
  type: varchar("type").notNull(), // 'correction' | 'achievement' | 'tip'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity").default("info"), // 'info' | 'warning' | 'success' | 'error'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Educational content
export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  contentType: varchar("content_type").notNull(), // 'article' | 'video' | 'exercise'
  category: varchar("category").notNull(), // 'posture' | 'ergonomics' | 'exercises'
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  readTime: integer("read_time"), // in minutes
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User reminders
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message"),
  frequency: varchar("frequency").notNull(), // 'once' | 'daily' | 'weekly' | 'custom'
  scheduledTime: timestamp("scheduled_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for validation
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

// Types
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
