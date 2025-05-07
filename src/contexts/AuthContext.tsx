
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Verificar se o usuário já está autenticado (simulando persistência)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Erro ao recuperar usuário:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulando a validação de login
    // Em um ambiente real, isso seria uma chamada de API
    const user = mockUsers.find(u => u.email === email);
    
    // Simulate a short delay for "network"
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user) {
      // Em produção, você deve verificar a senha hash no backend
      // Aqui estamos apenas simulando
      if (password === 'senha123') {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${user.name}!`,
        });
        return true;
      }
    }
    
    toast({
      title: "Erro de login",
      description: "Email ou senha incorretos.",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
