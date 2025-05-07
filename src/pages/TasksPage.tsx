
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { TeamProgress } from '@/components/TeamProgress';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

const TasksPage = () => {
  const { tasks } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getUserNameById = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Usuário Desconhecido';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Todas as Tarefas</h1>
          <p className="text-gray-600">Visão geral de todas as tarefas da equipe</p>
        </div>
        <Button 
          onClick={() => navigate('/tasks/create')}
          className="mt-3 sm:mt-0 flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>
      
      <TeamProgress />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="flex flex-col">
            <TaskCard task={task} />
            <div className="mt-2 px-4 text-xs text-gray-500">
              <p>Atribuído para: {getUserNameById(task.assignedTo)}</p>
              <p>Por: {getUserNameById(task.assignedBy)}</p>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
            <Button 
              onClick={() => navigate('/tasks/create')}
              variant="outline"
              className="mt-4"
            >
              Criar primeira tarefa
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => {
            // Aqui você implementaria a exportação CSV real
            alert('Exportação de tarefas para CSV - funcionalidade a ser implementada');
          }}
        >
          Exportar para CSV
        </Button>
      </div>
    </div>
  );
};

export default TasksPage;
