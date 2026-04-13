// Core data types for LifeOS

export type Priority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';
export type Frequency = 'daily' | 'weekly' | 'monthly';
export type EntertainmentType = 'movie' | 'series' | 'music' | 'game' | 'other';
export type FinanceCategory = 'food' | 'transport' | 'entertainment' | 'utilities' | 'health' | 'other';
export type TransactionType = 'income' | 'expense';
export type GymExerciseType = 'compound' | 'isolation' | 'cardio' | 'stretching';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  category: TaskCategory;
  createdAt: string;
}

export interface SomedayIdea {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  createdAt: string;
}

export interface EntertainmentEntry {
  id: string;
  title: string;
  type: EntertainmentType;
  rating?: number;
  notes?: string;
  watchedOn?: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GymExercise {
  id: string;
  name: string;
  type: GymExerciseType;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface GymWorkout {
  id: string;
  split: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';
  date: string;
  exercises: GymExercise[];
  notes?: string;
}

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  category: FinanceCategory;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}

export interface AnalyticsData {
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  totalIncome: number;
  totalExpenses: number;
  averageRating?: number;
  workoutsThisMonth: number;
}
