import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertPostureSessionSchema,
  insertUserExerciseSchema,
  insertProgressTrackingSchema,
  insertFeedbackSchema,
  insertReminderSchema,
  insertExerciseSchema,
  insertEducationalContentSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Posture session routes
  app.post("/api/posture-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertPostureSessionSchema.parse({
        ...req.body,
        userId,
      });
      const session = await storage.createPostureSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating posture session:", error);
      res.status(500).json({ message: "Failed to create posture session" });
    }
  });

  app.put("/api/posture-sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updatePostureSession(sessionId, updates);
      res.json(session);
    } catch (error) {
      console.error("Error updating posture session:", error);
      res.status(500).json({ message: "Failed to update posture session" });
    }
  });

  app.get("/api/posture-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserPostureSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching posture sessions:", error);
      res.status(500).json({ message: "Failed to fetch posture sessions" });
    }
  });

  app.get("/api/posture-sessions/active", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const session = await storage.getActivePostureSession(userId);
      res.json(session);
    } catch (error) {
      console.error("Error fetching active session:", error);
      res.status(500).json({ message: "Failed to fetch active session" });
    }
  });

  // Exercise routes
  app.get("/api/exercises", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category as string;
      const exercises = category
        ? await storage.getExercisesByCategory(category)
        : await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post("/api/exercises", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
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

  // User exercise routes
  app.get("/api/user-exercises/today", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const exercises = await storage.getUserExercisesToday(userId);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching today's exercises:", error);
      res.status(500).json({ message: "Failed to fetch today's exercises" });
    }
  });

  app.post("/api/user-exercises", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const exerciseData = insertUserExerciseSchema.parse({
        ...req.body,
        userId,
      });
      const userExercise = await storage.createUserExercise(exerciseData);
      res.json(userExercise);
    } catch (error) {
      console.error("Error creating user exercise:", error);
      res.status(500).json({ message: "Failed to create user exercise" });
    }
  });

  app.put("/api/user-exercises/:id", isAuthenticated, async (req, res) => {
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

  // Progress tracking routes
  app.get("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/progress/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 30;
      const history = await storage.getUserProgressHistory(userId, days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching progress history:", error);
      res.status(500).json({ message: "Failed to fetch progress history" });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertProgressTrackingSchema.parse({
        ...req.body,
        userId,
      });
      const progress = await storage.upsertUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Feedback routes
  app.get("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedbackList = await storage.getUserFeedback(userId);
      res.json(feedbackList);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId,
      });
      const feedbackItem = await storage.createFeedback(feedbackData);
      res.json(feedbackItem);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  app.put("/api/feedback/:id/read", isAuthenticated, async (req, res) => {
    try {
      const feedbackId = parseInt(req.params.id);
      await storage.markFeedbackAsRead(feedbackId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      res.status(500).json({ message: "Failed to mark feedback as read" });
    }
  });

  // Educational content routes
  app.get("/api/educational-content", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category as string;
      const content = category
        ? await storage.getEducationalContentByCategory(category)
        : await storage.getAllEducationalContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching educational content:", error);
      res.status(500).json({ message: "Failed to fetch educational content" });
    }
  });

  app.post("/api/educational-content", isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
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

  // Reminder routes
  app.get("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminders = await storage.getUserReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminderData = insertReminderSchema.parse({
        ...req.body,
        userId,
      });
      const reminder = await storage.createReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
