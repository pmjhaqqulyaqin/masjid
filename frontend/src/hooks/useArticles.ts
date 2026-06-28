import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Article {
  id: number;
  type: 'tausiyah' | 'pengumuman';
  title: string;
  content: string;
  author: string | null;
  imageUrl: string | null;
  publishedAt: string;
  createdAt: string;
}

export function useArticles() {
  const queryClient = useQueryClient();

  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: async (): Promise<Article[]> => {
      const res = await fetch(`${API_URL}/api/articles`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to create article');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update article');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete article');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    }
  });

  return {
    articles: articlesQuery.data || [],
    isLoading: articlesQuery.isLoading,
    error: articlesQuery.error,
    createArticle: createArticleMutation.mutateAsync,
    updateArticle: updateArticleMutation.mutateAsync,
    deleteArticle: deleteArticleMutation.mutateAsync
  };
}
