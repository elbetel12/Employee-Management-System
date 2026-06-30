import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Department, PaginatedResponse } from '../types';

export const useDepartments = (params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ['departments', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Department>>('/departments', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (newDept: Omit<Department, '_id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
      const { data } = await apiClient.post('/departments', newDept);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Department> }) => {
      const { data } = await apiClient.patch(`/departments/${id}`, updates);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/departments/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    departments: departmentsQuery.data?.data ?? [],
    meta: departmentsQuery.data?.meta,
    isLoading: departmentsQuery.isLoading,
    error: departmentsQuery.error,

    createDepartment: createDepartmentMutation.mutateAsync,
    isCreating: createDepartmentMutation.isPending,

    updateDepartment: updateDepartmentMutation.mutateAsync,
    isUpdating: updateDepartmentMutation.isPending,

    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    isDeleting: deleteDepartmentMutation.isPending,
  };
};

export const useDepartmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Department }>(`/departments/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
