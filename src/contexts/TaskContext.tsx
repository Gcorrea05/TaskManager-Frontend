
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task } from '../types';
import { mockTasks } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getTeamProgress: () => number;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  userTasks: [],
  addTask: () => {},
  updateTaskProgress: () => {},
  deleteTask: () => {},
  getTaskById: () => undefined,
  getTeamProgress: () => 0
});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Carregar tarefas
  useEffect(() => {
    // Em produção, isso seria uma chamada de API
    setTasks(mockTasks);
  }, []);

  // Filtrar tarefas do usuário
  const userTasks = tasks.filter(task => 
    currentUser ? task.assignedTo === currentUser.id : false
  );

  // Adicionar nova tarefa
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Tarefa criada",
      description: `A tarefa "${task.title}" foi criada com sucesso.`
    });
  };

  // Atualizar progresso da tarefa
  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, progress } 
          : task
      )
    );
    
    toast({
      title: "Progresso atualizado",
      description: `O progresso da tarefa foi atualizado para ${progress}%.`
    });
  };

  // Excluir tarefa
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) return;
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Tarefa removida",
      description: `A tarefa "${taskToDelete.title}" foi removida.`
    });
  };

  // Obter tarefa por ID
  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  // Calcular progresso da equipe
  const getTeamProgress = () => {
    if (tasks.length === 0) return 0;
    
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
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
        getTeamProgress
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
