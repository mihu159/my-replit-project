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
import { eq, desc, and, gte, lte, count, avg, sum } from "drizzle-orm";

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
    const [result] = await db.insert(postureSessions).values(session).returning();
    return result;
  }

  async updatePostureSession(id: number, updates: Partial<PostureSession>): Promise<PostureSession> {
    const [result] = await db
      .update(postureSessions)
      .set(updates)
      .where(eq(postureSessions.id, id))
      .returning();
    return result;
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
      .where(and(eq(postureSessions.userId, userId), eq(postureSessions.status, "active")));
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
      .where(and(eq(exercises.category, category), eq(exercises.isActive, true)))
      .orderBy(exercises.name);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [result] = await db.insert(exercises).values(exercise).returning();
    return result;
  }

  async updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise> {
    const [result] = await db
      .update(exercises)
      .set(updates)
      .where(eq(exercises.id, id))
      .returning();
    return result;
  }

  // User exercise operations
  async createUserExercise(userExercise: InsertUserExercise): Promise<UserExercise> {
    const [result] = await db.insert(userExercises).values(userExercise).returning();
    return result;
  }

  async updateUserExercise(id: number, updates: Partial<UserExercise>): Promise<UserExercise> {
    const [result] = await db
      .update(userExercises)
      .set(updates)
      .where(eq(userExercises.id, id))
      .returning();
    return result;
  }

  async getUserExercisesToday(userId: string): Promise<UserExercise[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select({
        id: userExercises.id,
        userId: userExercises.userId,
        exerciseId: userExercises.exerciseId,
        status: userExercises.status,
        startTime: userExercises.startTime,
        endTime: userExercises.endTime,
        notes: userExercises.notes,
        createdAt: userExercises.createdAt,
        exercise: exercises,
      })
      .from(userExercises)
      .leftJoin(exercises, eq(userExercises.exerciseId, exercises.id))
      .where(
        and(
          eq(userExercises.userId, userId),
          gte(userExercises.createdAt, today),
          lte(userExercises.createdAt, tomorrow)
        )
      )
      .orderBy(userExercises.createdAt);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [existing] = await db
      .select()
      .from(progressTracking)
      .where(and(eq(progressTracking.userId, progress.userId), gte(progressTracking.date, today)));

    if (existing) {
      const [result] = await db
        .update(progressTracking)
        .set(progress)
        .where(eq(progressTracking.id, existing.id))
        .returning();
      return result;
    } else {
      const [result] = await db.insert(progressTracking).values(progress).returning();
      return result;
    }
  }

  async getUserProgressHistory(userId: string, days = 30): Promise<ProgressTracking[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await db
      .select()
      .from(progressTracking)
      .where(and(eq(progressTracking.userId, userId), gte(progressTracking.date, startDate)))
      .orderBy(desc(progressTracking.date));
  }

  async getUserStats(userId: string): Promise<{
    weeklyProgress: number;
    sessionsToday: number;
    streakDays: number;
    totalCorrections: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get sessions today
    const [sessionsToday] = await db
      .select({ count: count() })
      .from(postureSessions)
      .where(
        and(
          eq(postureSessions.userId, userId),
          gte(postureSessions.createdAt, today),
          lte(postureSessions.createdAt, tomorrow)
        )
      );

    // Get latest progress for weekly progress and streak
    const [latestProgress] = await db
      .select()
      .from(progressTracking)
      .where(eq(progressTracking.userId, userId))
      .orderBy(desc(progressTracking.date))
      .limit(1);

    // Get total corrections
    const [totalCorrections] = await db
      .select({ total: sum(postureSessions.correctionCount) })
      .from(postureSessions)
      .where(eq(postureSessions.userId, userId));

    return {
      weeklyProgress: latestProgress?.weeklyScore || 0,
      sessionsToday: sessionsToday.count,
      streakDays: latestProgress?.streakDays || 0,
      totalCorrections: Number(totalCorrections.total) || 0,
    };
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [result] = await db.insert(feedback).values(feedbackData).returning();
    return result;
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
      .where(and(eq(educationalContent.category, category), eq(educationalContent.isPublished, true)))
      .orderBy(desc(educationalContent.createdAt));
  }

  async createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent> {
    const [result] = await db.insert(educationalContent).values(content).returning();
    return result;
  }

  // Reminder operations
  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [result] = await db.insert(reminders).values(reminder).returning();
    return result;
  }

  async getUserReminders(userId: string): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.userId, userId), eq(reminders.isActive, true)))
      .orderBy(reminders.scheduledTime);
  }

  async updateReminder(id: number, updates: Partial<Reminder>): Promise<Reminder> {
    const [result] = await db
      .update(reminders)
      .set(updates)
      .where(eq(reminders.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
