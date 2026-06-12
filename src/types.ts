export type AchievementLevel = "Beginner" | "Intermediate" | "Advanced";

export type AchievementStatus = "pending" | "approved" | "rejected";

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
  displayName: string;
}

export interface MemberDetails {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  skills: string;
}

export interface Achievement {
  id: string;
  username: string;
  title: string;
  description: string;
  level: AchievementLevel;
  date: string;
  status: AchievementStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export type Page = "login" | "dashboard" | "admin" | "leaderboard" | "settings";
