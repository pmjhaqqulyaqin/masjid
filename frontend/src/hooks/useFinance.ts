import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useFinance() {
  const queryClient = useQueryClient();

  const financeQuery = useQuery({
    queryKey: ['finance'],
    queryFn: async () => {
      const { data } = await api.get('/finance');
      return data;
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['finance-summary'],
    queryFn: async () => {
      const { data } = await api.get('/finance/summary');
      return data;
    },
  });

  const createFinanceMutation = useMutation({
    mutationFn: async (newRecord: any) => {
      const { data } = await api.post('/finance', newRecord);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
    },
  });

  return {
    financeQuery,
    summaryQuery,
    createFinanceMutation,
  };
}
