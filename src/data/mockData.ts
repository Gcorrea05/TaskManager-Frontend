
import { User, Task } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@gemeodigital.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@gemeodigital.com',
    role: 'membro'
  },
  {
    id: '3',
    name: 'Maria Souza',
    email: 'maria@gemeodigital.com',
    role: 'membro'
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro@gemeodigital.com',
    role: 'membro'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Desenvolvimento da API de dados do sensor',
    description: 'Criar endpoints para receber e processar os dados dos sensores IoT do sistema de gêmeo digital.',
    progress: 70,
    dueDate: '2023-06-15',
    assignedTo: '2',
    assignedBy: '1',
    createdAt: '2023-05-20'
  },
  {
    id: '2',
    title: 'Implementação do módulo de visualização 3D',
    description: 'Integrar a biblioteca Three.js para visualização do modelo 3D do gêmeo digital.',
    progress: 30,
    dueDate: '2023-06-30',
    assignedTo: '3',
    assignedBy: '1',
    createdAt: '2023-05-25'
  },
  {
    id: '3',
    title: 'Documentação da arquitetura do sistema',
    description: 'Preparar documentação técnica detalhando a arquitetura do sistema de gêmeo digital.',
    progress: 50,
    dueDate: '2023-06-10',
    assignedTo: '4',
    assignedBy: '1',
    createdAt: '2023-05-15'
  },
  {
    id: '4',
    title: 'Testes de integração com simulador',
    description: 'Realizar testes de integração entre o gêmeo digital e o simulador físico.',
    progress: 10,
    dueDate: '2023-07-05',
    assignedTo: '2',
    assignedBy: '3',
    createdAt: '2023-05-28'
  }
];
