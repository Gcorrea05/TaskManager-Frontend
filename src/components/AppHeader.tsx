
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold text-task-blue">Task Twin</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-task-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
          </div>
          
          <Button onClick={() => logout()} variant="outline" size="sm">
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
