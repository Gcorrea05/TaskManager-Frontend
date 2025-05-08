import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, CalendarClock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertSettings } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AlertsPage = () => {
  const { tasks, updateTaskProgress } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    defaultDaysBeforeDue: 3,
    enableEmailAlerts: true,
  });

  const [taskAlerts, setTaskAlerts] = useState<Record<string, { enabled: boolean; daysBeforeDue: number }>>({});

  // Função para calcular os dias restantes até o prazo
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleTaskAlert = (taskId: string, enabled: boolean) => {
    setTaskAlerts((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || { daysBeforeDue: alertSettings.defaultDaysBeforeDue }),
        enabled,
      },
    }));

    toast({
      title: enabled ? 'Alerta ativado' : 'Alerta desativado',
      description: `O alerta para a tarefa foi ${enabled ? 'ativado' : 'desativado'}.`,
    });
  };

  const updateDaysBeforeDue = (taskId: string, days: number) => {
    setTaskAlerts((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || { enabled: false }),
        daysBeforeDue: days,
      },
    }));
  };

  const sendTestAlert = () => {
    toast({
      title: 'Email de teste enviado',
      description: 'Um email de teste foi enviado para o seu endereço cadastrado.',
    });
  };

  const saveAlertSettings = () => {
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações de alertas foram salvas com sucesso.',
    });
  };

  const pendingTasks = tasks.filter((task) => task.progress < 100);

  const sortedTasks = [...pendingTasks].sort((a, b) => {
    const daysA = getDaysRemaining(a.dueDate);
    const daysB = getDaysRemaining(b.dueDate);
    return daysA - daysB;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alertas de Prazo</h1>
          <p className="text-gray-600">Configure alertas por email para prazos de tarefas</p>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Configurações de Alertas</span>
            </CardTitle>
            <CardDescription>Defina as configurações padrão para os alertas de prazo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Ativar alertas por email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas por email quando as tarefas estiverem perto do prazo
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={alertSettings.enableEmailAlerts}
                onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, enableEmailAlerts: checked })}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="days-before">Dias antes do prazo para alertar</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="days-before"
                  type="number"
                  value={alertSettings.defaultDaysBeforeDue}
                  onChange={(e) =>
                    setAlertSettings({ ...alertSettings, defaultDaysBeforeDue: Number(e.target.value) })
                  }
                  min={1}
                  max={30}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">dias antes do prazo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Esta configuração será usada como padrão para novas tarefas
              </p>
            </div>

            <div className="pt-2">
              <Button variant="outline" onClick={sendTestAlert}>
                Enviar email de teste
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveAlertSettings}>Salvar configurações</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              <span>Tarefas com Prazo Próximo</span>
            </CardTitle>
            <CardDescription>Gerencie alertas para tarefas com prazos próximos</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedTasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Dias restantes</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Alerta</TableHead>
                    <TableHead>Dias antes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => {
                    const daysRemaining = getDaysRemaining(task.dueDate);
                    const isUrgent = daysRemaining <= 3;
                    const taskAlert = taskAlerts[task.id] || {
                      enabled: false,
                      daysBeforeDue: alertSettings.defaultDaysBeforeDue,
                    };

                    return (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${isUrgent ? 'text-red-600' : ''}`}>
                            {daysRemaining} dia(s)
                          </span>
                        </TableCell>
                        <TableCell>{task.assignedToName || 'Usuário Desconhecido'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={taskAlert.enabled}
                            onCheckedChange={(checked) => toggleTaskAlert(task.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={taskAlert.daysBeforeDue}
                            onChange={(e) => updateDaysBeforeDue(task.id, Number(e.target.value))}
                            min={1}
                            max={30}
                            disabled={!taskAlert.enabled}
                            className="w-16"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Não há tarefas pendentes com prazo definido</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/tasks')}>
              Ver todas as tarefas
            </Button>
            <Button onClick={saveAlertSettings}>Salvar alterações</Button>
          </CardFooter>
        </Card>
      </div>

      <Alert className="mb-6">
        <AlertTitle>Como funcionam os alertas?</AlertTitle>
        <AlertDescription>
          Quando uma tarefa estiver próxima do prazo de entrega, um email será enviado automaticamente
          para o responsável. Você pode configurar quantos dias antes do prazo o alerta deve ser enviado.
          Alertas são enviados apenas uma vez para cada tarefa.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertsPage;
