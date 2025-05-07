
import { useTasks } from '@/contexts/TaskContext';
import { TeamProgress } from '@/components/TeamProgress';
import { TaskCard } from '@/components/TaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { userTasks } = useTasks();
  const { currentUser } = useAuth();
  
  // Filtrando tarefas por status
  const completedTasks = userTasks.filter(task => task.progress === 100);
  const pendingTasks = userTasks.filter(task => task.progress < 100);
  const urgentTasks = pendingTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    return dueDate <= threeDaysLater;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo(a), {currentUser?.name}!</p>
      </div>
      
      <TeamProgress />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-red-600">
              Urgente e Pendente
            </CardTitle>
            <CardDescription>
              Tarefas com prazo próximo ou vencido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <p className="text-sm text-gray-500">Nenhuma tarefa urgente pendente.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-blue-600">
              Outras Tarefas Pendentes
            </CardTitle>
            <CardDescription>
              Tarefas em andamento com prazo mais longo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks
              .filter(task => !urgentTasks.includes(task))
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            {pendingTasks.length === urgentTasks.length && (
              <p className="text-sm text-gray-500">Nenhuma tarefa pendente com prazo longo.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-green-600">
            Tarefas Concluídas
          </CardTitle>
          <CardDescription>
            Tarefas que você já finalizou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map(task => (
              <TaskCard key={task.id} task={task} showControls={false} />
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma tarefa concluída ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
