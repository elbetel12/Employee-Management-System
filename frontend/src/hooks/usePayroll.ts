import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Payroll, PaginatedResponse } from '../types';

export const usePayroll = (params: {
  page?: number;
  limit?: number;
  employeeId?: string;
  month?: number;
  year?: number;
  department?: string;
} = {}) => {
  const queryClient = useQueryClient();

  const payrollsQuery = useQuery({
    queryKey: ['payrolls', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Payroll>>('/payrolls', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const generatePayrollMutation = useMutation({
    mutationFn: async (payload: { payDate: string }) => {
      const { data } = await apiClient.post('/payrolls/generate', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updatePayrollMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { bonuses?: number; deductions?: number; taxes?: number };
    }) => {
      const { data } = await apiClient.patch(`/payrolls/${id}`, updates);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', variables.id] });
    },
  });

  return {
    payrolls: payrollsQuery.data?.data ?? [],
    meta: payrollsQuery.data?.meta,
    isLoading: payrollsQuery.isLoading,
    error: payrollsQuery.error,

    generatePayroll: generatePayrollMutation.mutateAsync,
    isGenerating: generatePayrollMutation.isPending,

    updatePayroll: updatePayrollMutation.mutateAsync,
    isUpdating: updatePayrollMutation.isPending,
  };
};

export const usePayrollDetail = (id: string) => {
  return useQuery({
    queryKey: ['payroll', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Payroll }>(`/payrolls/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
