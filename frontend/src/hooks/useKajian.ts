import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useKajian() {
  const queryClient = useQueryClient();

  const kajianQuery = useQuery({
    queryKey: ['kajian'],
    queryFn: async () => {
      const { data } = await api.get('/kajian');
      return data;
    },
  });

  const createKajianMutation = useMutation({
    mutationFn: async (newKajian: any) => {
      const { data } = await api.post('/kajian', newKajian);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kajian'] });
    },
  });

  const deleteKajianMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/kajian/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kajian'] });
    },
  });

  const updateKajianMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/kajian/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kajian'] });
    },
  });

  return {
    kajianQuery,
    createKajianMutation,
    updateKajianMutation,
    deleteKajianMutation,
  };
}
