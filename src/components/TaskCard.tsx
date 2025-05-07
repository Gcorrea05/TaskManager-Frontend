import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useTasks } from '@/contexts/TaskContext';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskCardProps {
  task: Task;
  showControls?: boolean;
}

export const TaskCard = ({ task, showControls = true }: TaskCardProps) => {
  const { updateTaskProgress } = useTasks();

  const [editableSubtasks, setEditableSubtasks] = useState(task.subtasks || []);
  const [progress, setProgress] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const completed = editableSubtasks.filter(st => st.completed).length;
    const total = editableSubtasks.length;
    const calcProgress = total === 0 ? 0 : Math.round((completed / total) * 100);
    setProgress(calcProgress);
  }, [editableSubtasks]);

  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < today && progress < 100;
  const isDueSoon = !isOverdue && dueDate <= new Date(today.setDate(today.getDate() + 3)) && progress < 100;
  const isCompleted = progress === 100;

  const handleUpdateProgress = () => {
    updateTaskProgress(task.id, progress, editableSubtasks); // envia subtasks atualizadas
    setIsUpdateMode(false);
  };

  const toggleSubtask = (index: number) => {
    const updated = [...editableSubtasks];
    updated[index].completed = !updated[index].completed;
    setEditableSubtasks(updated);
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-task-green';
    if (isOverdue) return 'bg-task-red';
    if (isDueSoon) return 'bg-task-yellow';
    return 'bg-task-blue';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Concluído';
    if (isOverdue) return 'Atrasado';
    if (isDueSoon) return 'Em breve';
    return 'Em andamento';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 animate-fade-in">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
        <div className={`${getStatusColor()} text-white text-xs font-medium py-1 px-2 rounded-full flex items-center`}>
          {isCompleted && <CheckCircle className="h-3 w-3 mr-1" />}
          {isOverdue && <AlertCircle className="h-3 w-3 mr-1" />}
          {getStatusText()}
        </div>
      </div>

      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Prazo: {formatDate(task.dueDate)}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progresso</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress className="mt-1" value={progress} />
        <p className="text-xs text-gray-500 mt-1">
          {editableSubtasks.filter(st => st.completed).length}/{editableSubtasks.length} subtarefas concluídas
        </p>
      </div>

      {editableSubtasks.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm">
          {editableSubtasks.map((subtask, index) => (
            <li key={subtask.id} className={subtask.completed ? "line-through text-green-600" : ""}>
              {subtask.title}
              {isUpdateMode && (
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => toggleSubtask(index)}
                  className="ml-2"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Ver briefing</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription className="pt-4">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Prazo: {formatDate(task.dueDate)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Progresso atual: {progress}%
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {showControls && (
          <div className="space-x-2">
            {isUpdateMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsUpdateMode(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleUpdateProgress}>
                  Salvar
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsUpdateMode(true)}>
                Atualizar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
