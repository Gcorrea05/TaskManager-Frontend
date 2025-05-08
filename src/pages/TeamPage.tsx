import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskContext';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUsers } from '@/hooks/useUsers';

const TeamPage = () => {
  const { tasks } = useTasks();
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Carregando usuários...</div>;

  const teamMetrics = users.map((user) => {
    const userTasks = tasks.filter((task) => task.assigned_to === user.id);
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter((task) => task.progress === 100).length;
    const avgProgress =
      totalTasks > 0
        ? Math.round(userTasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks)
        : 0;

    const pendingTasks = userTasks.filter((task) => task.progress < 100);
    const urgentTasks = pendingTasks.filter((task) => {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      return dueDate <= today;
    });

    return {
      ...user,
      totalTasks,
      completedTasks,
      avgProgress,
      pendingTasks: totalTasks - completedTasks,
      urgentTasks: urgentTasks.length,
    };
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Equipe</h1>
        <p className="text-gray-600">Visão geral do desempenho da equipe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMetrics.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-task-blue text-white">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="capitalize">{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Progresso Geral</span>
                    <span className="text-sm font-medium">{member.avgProgress}%</span>
                  </div>
                  <Progress value={member.avgProgress} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded py-2">
                    <p className="text-xl font-bold text-task-blue">{member.totalTasks}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="bg-gray-50 rounded py-2">
                    <p className="text-xl font-bold text-green-500">{member.completedTasks}</p>
                    <p className="text-xs text-gray-500">Concluídas</p>
                  </div>
                  <div className="bg-gray-50 rounded py-2">
                    <p className="text-xl font-bold text-red-500">{member.urgentTasks}</p>
                    <p className="text-xs text-gray-500">Urgentes</p>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p className="text-center">
                    {member.pendingTasks}{' '}
                    {member.pendingTasks === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
