
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTasks } from '@/contexts/TaskContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();
  
  if (!currentUser) {
    return <div>Carregando...</div>;
  }
  
  // Obter tarefas do usuário
  const userTasks = tasks.filter(task => task.assignedTo === currentUser.id);
  const tasksCreated = tasks.filter(task => task.assignedBy === currentUser.id);
  const completedTasks = userTasks.filter(task => task.progress === 100);
  const pendingTasks = userTasks.filter(task => task.progress < 100);
  
  // Cálculo de métricas
  const avgProgress = userTasks.length > 0
    ? Math.round(userTasks.reduce((sum, task) => sum + task.progress, 0) / userTasks.length)
    : 0;
    
  const tasksOnTime = completedTasks.filter(task => {
    const completionDate = new Date(); // Na vida real, seria a data de conclusão registrada
    const dueDate = new Date(task.dueDate);
    return completionDate <= dueDate;
  }).length;
  
  // Obter as iniciais do nome do usuário
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
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-gray-600">Suas informações e estatísticas</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-task-blue text-white">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                <p className="text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              
              <div className="w-full space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{currentUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium">{currentUser.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo de Atividades</CardTitle>
            <CardDescription>Suas estatísticas e desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-task-blue">{userTasks.length}</p>
                <p className="text-sm text-gray-500">Tarefas Atribuídas</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
                <p className="text-sm text-gray-500">Tarefas Concluídas</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">{tasksCreated.length}</p>
                <p className="text-sm text-gray-500">Tarefas Criadas</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{pendingTasks.length}</p>
                <p className="text-sm text-gray-500">Pendentes</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Progresso Médio:</span>
                        <span className="font-medium">{avgProgress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tarefas no Prazo:</span>
                        <span className="font-medium">
                          {tasksOnTime}/{completedTasks.length} ({completedTasks.length ? Math.round((tasksOnTime / completedTasks.length) * 100) : 0}%)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Placeholder para recursos futuros */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Recursos Futuros</h3>
              <div className="text-gray-500 text-sm space-y-2">
                <p>• Relatórios detalhados de produtividade</p>
                <p>• Integração com métricas do gêmeo digital</p>
                <p>• Exportação de dados em PDF e CSV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
