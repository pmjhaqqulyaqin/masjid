import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useDonations() {
  const queryClient = useQueryClient();

  const donationsQuery = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await api.get('/donations');
      return data;
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['donations-summary'],
    queryFn: async () => {
      const { data } = await api.get('/donations/summary');
      return data;
    },
  });

  const createDonationMutation = useMutation({
    mutationFn: async (newDonation: any) => {
      const { data } = await api.post('/donations', newDonation);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donations-summary'] });
    },
  });

  return {
    donationsQuery,
    summaryQuery,
    createDonationMutation,
  };
}
