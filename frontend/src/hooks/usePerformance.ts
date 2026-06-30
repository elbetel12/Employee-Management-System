import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Performance, PaginatedResponse } from '../types';

export const usePerformance = (params: {
  page?: number;
  limit?: number;
  employeeId?: string;
  department?: string;
  search?: string;
  month?: number;
  year?: number;
} = {}) => {
  const queryClient = useQueryClient();

  const performanceQuery = useQuery({
    queryKey: ['performance', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Performance>>('/performance', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const evaluateMutation = useMutation({
    mutationFn: async ({
      employeeId,
      evaluation,
    }: {
      employeeId: string;
      evaluation: { comments?: string };
    }) => {
      const { data } = await apiClient.post(
        `/performance/${employeeId}/evaluate`,
        evaluation
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    evaluations: performanceQuery.data?.data ?? [],
    meta: performanceQuery.data?.meta,
    isLoading: performanceQuery.isLoading,
    error: performanceQuery.error,

    evaluate: evaluateMutation.mutateAsync,
    isEvaluating: evaluateMutation.isPending,
  };
};
