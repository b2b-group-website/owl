export interface WorkEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  task: string;
  createdAt: string;
}

export interface Note {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface Settings {
  hourlyRate: number;
  currency: string;
  tasks: string[];
}

export interface AppData {
  workEntries: WorkEntry[];
  notes: Note[];
  expenses: Expense[];
  settings: Settings;
}