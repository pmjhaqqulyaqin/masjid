import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useFacilities() {
  const queryClient = useQueryClient();

  const facilitiesQuery = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/facilities`);
      if (!res.ok) throw new Error('Failed to fetch facilities');
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newFacility: any) => {
      const res = await fetch(`${API_URL}/facilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility)
      });
      if (!res.ok) throw new Error('Failed to create facility');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await fetch(`${API_URL}/facilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update facility');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/facilities/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete facility');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    }
  });

  return {
    facilities: facilitiesQuery.data ?? [],
    isLoading: facilitiesQuery.isLoading,
    createFacility: createMutation.mutate,
    updateFacility: updateMutation.mutate,
    deleteFacility: deleteMutation.mutate
  };
}
