
import { Progress } from '@/components/ui/progress';
import { useTasks } from '@/contexts/TaskContext';

export const TeamProgress = () => {
  const { getTeamProgress } = useTasks();
  const teamProgress = getTeamProgress();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">Progresso da Equipe</h3>
        <span className="font-bold text-lg text-task-blue">{teamProgress}%</span>
      </div>
      <Progress value={teamProgress} className="h-3" />
    </div>
  );
};
