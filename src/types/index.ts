
export type UserRole = 'admin' | 'membro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  notificationPreferences?: {
    newTasks: boolean;
    taskUpdates: boolean;
    mentions: boolean;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
}
