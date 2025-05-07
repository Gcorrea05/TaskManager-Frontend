
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AccountOverlay } from './AccountOverlay';
import { useState } from 'react';

export const AppHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showAccountOverlay, setShowAccountOverlay] = useState(false);
  
  return (
    <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate('/alerts')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-task-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/alerts')}>
                Alertas de Prazo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAccountOverlay(true)}>
                Configurações da Conta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {showAccountOverlay && (
        <AccountOverlay onClose={() => setShowAccountOverlay(false)} />
      )}
    </header>
  );
};
