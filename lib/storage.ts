// localStorage utilities for client-side data persistence

import { Task, Template, SomedayIdea, EntertainmentEntry, Idea, GymWorkout, FinanceTransaction } from './types';

const STORAGE_KEYS = {
  tasks: 'lifeos_tasks',
  templates: 'lifeos_templates',
  someday: 'lifeos_someday',
  entertainment: 'lifeos_entertainment',
  ideas: 'lifeos_ideas',
  gym: 'lifeos_gym',
  finance: 'lifeos_finance',
};

// Generic storage functions
export const getItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage:', key);
  }
};

// Task storage
export const getTasks = (): Task[] => getItem(STORAGE_KEYS.tasks, []);
export const setTasks = (tasks: Task[]): void => setItem(STORAGE_KEYS.tasks, tasks);

// Template storage
export const getTemplates = (): Template[] => getItem(STORAGE_KEYS.templates, []);
export const setTemplates = (templates: Template[]): void => setItem(STORAGE_KEYS.templates, templates);

// Someday storage
export const getSomedayIdeas = (): SomedayIdea[] => getItem(STORAGE_KEYS.someday, []);
export const setSomedayIdeas = (ideas: SomedayIdea[]): void => setItem(STORAGE_KEYS.someday, ideas);

// Entertainment storage
export const getEntertainmentEntries = (): EntertainmentEntry[] => getItem(STORAGE_KEYS.entertainment, []);
export const setEntertainmentEntries = (entries: EntertainmentEntry[]): void => setItem(STORAGE_KEYS.entertainment, entries);

// Ideas storage
export const getIdeas = (): Idea[] => getItem(STORAGE_KEYS.ideas, []);
export const setIdeas = (ideas: Idea[]): void => setItem(STORAGE_KEYS.ideas, ideas);

// Gym storage
export const getGymWorkouts = (): GymWorkout[] => getItem(STORAGE_KEYS.gym, []);
export const setGymWorkouts = (workouts: GymWorkout[]): void => setItem(STORAGE_KEYS.gym, workouts);

// Finance storage
export const getFinanceTransactions = (): FinanceTransaction[] => getItem(STORAGE_KEYS.finance, []);
export const setFinanceTransactions = (transactions: FinanceTransaction[]): void => setItem(STORAGE_KEYS.finance, transactions);

// Initialize with mock data
export const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.tasks)) {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'React loyihasini yakunlash',
        description: 'Barcha komponentlarni test qilish',
        priority: 'high',
        category: 'work',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Jismoniy mashq qilish',
        description: 'Togri yo\'naltirilgan trening',
        priority: 'medium',
        category: 'health',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];
    setTasks(mockTasks);
  }

  if (!localStorage.getItem(STORAGE_KEYS.finance)) {
    const mockTransactions: FinanceTransaction[] = [
      {
        id: '1',
        type: 'income',
        category: 'other',
        amount: 500000,
        description: 'Oylik maosh',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'expense',
        category: 'food',
        amount: 50000,
        description: 'Restoran',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
    ];
    setFinanceTransactions(mockTransactions);
  }

  if (!localStorage.getItem(STORAGE_KEYS.entertainment)) {
    const mockEntertainment: EntertainmentEntry[] = [
      {
        id: '1',
        title: 'Dune',
        type: 'movie',
        rating: 4.5,
        notes: 'Ajoyib kinematografiya',
        watchedOn: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
    ];
    setEntertainmentEntries(mockEntertainment);
  }
};
