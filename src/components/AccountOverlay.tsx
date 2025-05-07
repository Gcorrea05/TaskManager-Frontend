
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User, Mail, Key, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface AccountOverlayProps {
  onClose: () => void;
}

export const AccountOverlay: React.FC<AccountOverlayProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  // Configurações de notificações (simuladas)
  const [notifyNewTasks, setNotifyNewTasks] = useState(true);
  const [notifyTaskUpdates, setNotifyTaskUpdates] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não correspondem",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    // Aqui seria a integração com o banco de dados
    // Por enquanto, apenas simulamos o sucesso
    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso",
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples de e-mail
    if (!email.includes('@')) {
      toast({
        title: "Erro",
        description: "E-mail inválido",
        variant: "destructive"
      });
      return;
    }
    
    // Aqui seria a integração com o banco de dados
    // Por enquanto, apenas simulamos o sucesso
    toast({
      title: "Sucesso",
      description: "E-mail atualizado com sucesso",
    });
  };
  
  const handleSaveNotifications = () => {
    // Aqui seria a integração com o banco de dados
    // Por enquanto, apenas simulamos o sucesso
    toast({
      title: "Sucesso",
      description: "Preferências de notificação atualizadas",
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configurações da Conta</h2>
          
          <Tabs defaultValue="password">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="password">Senha</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Alertas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type="password"
                      className="pl-10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Sua senha atual"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      className="pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Atualizar Senha
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="email">
              <form onSubmit={handleChangeEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu novo email"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Atualizar Email
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-new-tasks">Novas Tarefas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações de novas tarefas
                    </p>
                  </div>
                  <Switch
                    id="notify-new-tasks"
                    checked={notifyNewTasks}
                    onCheckedChange={setNotifyNewTasks}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-updates">Atualizações de Tarefas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando tarefas são atualizadas
                    </p>
                  </div>
                  <Switch
                    id="notify-updates"
                    checked={notifyTaskUpdates}
                    onCheckedChange={setNotifyTaskUpdates}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-mentions">Menções</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações quando for mencionado
                    </p>
                  </div>
                  <Switch
                    id="notify-mentions"
                    checked={notifyMentions}
                    onCheckedChange={setNotifyMentions}
                  />
                </div>
                
                <Button onClick={handleSaveNotifications} className="w-full mt-4">
                  Salvar Preferências
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
