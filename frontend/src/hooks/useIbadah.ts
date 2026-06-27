import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useIbadah() {
  const queryClient = useQueryClient();
  const ibadahQuery = useQuery({
    queryKey: ['jadwal-shalat'],
    queryFn: async () => {
      const { data } = await api.get('/ibadah/jadwal');
      return data;
    },
  });

  const createIbadahMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { data } = await api.post('/ibadah/jadwal', newData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-shalat'] });
    },
  });

  const updateIbadahMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/ibadah/jadwal/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-shalat'] });
    },
  });

  const deleteIbadahMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/ibadah/jadwal/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-shalat'] });
    },
  });

  return {
    ibadahQuery,
    createIbadahMutation,
    updateIbadahMutation,
    deleteIbadahMutation,
  };
}
