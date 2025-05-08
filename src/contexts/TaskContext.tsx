import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import api from '@/api/api';

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTaskProgress: (taskId: string, progress: number) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  getTeamProgress: () => number;
  updateTaskAlert: (taskId: string, alertSettings: Task['alertSettings']) => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  userTasks: [],
  addTask: async () => {},
  updateTaskProgress: async () => {},
  deleteTask: async () => {},
  getTaskById: () => undefined,
  getTeamProgress: () => 0,
  updateTaskAlert: () => {},
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Carregar tarefas do backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        const data = response.data;
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    };

    fetchTasks();
  }, []);

  const userTasks = Array.isArray(tasks)
    ? tasks.filter(task => currentUser && task.assigned_to === currentUser.id)
    : [];

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await api.post('/tasks', task);
      const newTask = response.data;
      setTasks(prev => [...prev, newTask]);

      toast({
        title: 'Tarefa criada',
        description: `A tarefa "${newTask.title}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const updateTaskProgress = async (taskId: string, progress: number) => {
    try {
      await api.put(`/tasks/${taskId}`, { progress });

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, progress } : task
        )
      );

      toast({
        title: 'Progresso atualizado',
        description: `O progresso foi atualizado para ${progress}%.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks(prev => prev.filter(task => task.id !== taskId));

      toast({
        title: 'Tarefa removida',
        description: `A tarefa foi removida com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const getTeamProgress = () => {
    if (tasks.length === 0) return 0;

    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  const updateTaskAlert = (taskId: string, alertSettings: Task['alertSettings']) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, alertSettings } : task
      )
    );
    toast({
      title: 'Alertas atualizados',
      description: 'As configurações de alerta foram atualizadas.',
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userTasks,
        addTask,
        updateTaskProgress,
        deleteTask,
        getTaskById,
        getTeamProgress,
        updateTaskAlert,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
