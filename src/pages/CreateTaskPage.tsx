import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [subtasks, setSubtasks] = useState([{ id: Date.now(), title: '', completed: false }]);
  const [users, setUsers] = useState([]);

  const { addTask } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const apiUrl = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: '', completed: false }]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].title = value;
    setSubtasks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !assignedTo) {
      return;
    }

    const filteredSubtasks = subtasks.filter((st) => st.title.trim() !== '');

    await addTask({
      title,
      description,
      progress: 0,
      dueDate,
      assignedTo,
      assignedBy: currentUser?.id || '',
      subtasks: filteredSubtasks,
    });

    navigate('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nova Tarefa</h1>
        <p className="text-gray-600">Crie uma nova tarefa para a equipe</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Tarefa</CardTitle>
          <CardDescription>Preencha todas as informações necessárias para a nova tarefa.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição / Briefing</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os detalhes da tarefa, objetivos e resultados esperados"
                className="min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Prazo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Atribuir para</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.id !== currentUser?.id)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subtarefas</Label>
              {subtasks.map((subtask, index) => (
                <Input
                  key={subtask.id}
                  placeholder={`Subtarefa ${index + 1}`}
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  className="mb-2"
                />
              ))}
              <Button type="button" onClick={handleAddSubtask}>
                + Adicionar Subtarefa
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/tasks')}>
              Cancelar
            </Button>
            <Button type="submit">Criar Tarefa</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
