import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Employee, PaginatedResponse } from '../types';

export const useEmployees = (params: {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  isActive?: boolean;
} = {}) => {
  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Employee>>('/employees', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (newEmployee: Omit<Employee, '_id' | 'fullName' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
      const { data } = await apiClient.post('/employees', newEmployee);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Employee> }) => {
      const { data } = await apiClient.patch(`/employees/${id}`, updates);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/employees/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    employees: employeesQuery.data?.data ?? [],
    meta: employeesQuery.data?.meta,
    isLoading: employeesQuery.isLoading,
    isFetching: employeesQuery.isFetching,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,

    createEmployee: createEmployeeMutation.mutateAsync,
    isCreating: createEmployeeMutation.isPending,

    updateEmployee: updateEmployeeMutation.mutateAsync,
    isUpdating: updateEmployeeMutation.isPending,

    deleteEmployee: deleteEmployeeMutation.mutateAsync,
    isDeleting: deleteEmployeeMutation.isPending,
  };
};

export const useEmployeeDetail = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Employee }>(`/employees/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
