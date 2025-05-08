import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';

export const useUsers = () => {
  return useQuery(['users'], async () => {
    const response = await api.get('/users');
    return response.data;
  });
};
