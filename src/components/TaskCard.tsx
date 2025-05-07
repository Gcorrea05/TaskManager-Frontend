
import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useTasks } from '@/contexts/TaskContext';
import { Slider } from '@/components/ui/slider';

interface TaskCardProps {
  task: Task;
  showControls?: boolean;
}

export const TaskCard = ({ task, showControls = true }: TaskCardProps) => {
  const { updateTaskProgress } = useTasks();
  const [progress, setProgress] = useState(task.progress);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < today && task.progress < 100;
  const isDueSoon = !isOverdue && dueDate <= new Date(today.setDate(today.getDate() + 3)) && task.progress < 100;
  const isCompleted = task.progress === 100;

  const handleUpdateProgress = () => {
    updateTaskProgress(task.id, progress);
    setIsUpdateMode(false);
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
          <span className="font-medium">{task.progress}%</span>
        </div>
        <Progress className="mt-1" value={task.progress} />
      </div>
      
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
                  Progresso atual: {task.progress}%
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
      
      {isUpdateMode && (
        <div className="mt-4">
          <label className="text-sm text-gray-600">Ajustar progresso:</label>
          <div className="flex items-center mt-2">
            <Slider 
              value={[progress]} 
              min={0} 
              max={100} 
              step={5}
              onValueChange={(value) => setProgress(value[0])}
              className="mr-4"
            />
            <span className="w-10 text-sm font-medium">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
