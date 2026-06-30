import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Leave, PaginatedResponse } from '../types';

export const useLeaves = (params: {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  search?: string;
} = {}) => {
  const queryClient = useQueryClient();

  const leavesQuery = useQuery({
    queryKey: ['leaves', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Leave>>('/leaves', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const requestLeaveMutation = useMutation({
    mutationFn: async (leaveData: {
      employeeId: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      reason?: string;
    }) => {
      const { data } = await apiClient.post('/leaves', leaveData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateLeaveStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/leaves/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const deleteLeaveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/leaves/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });

  return {
    leaves: leavesQuery.data?.data ?? [],
    meta: leavesQuery.data?.meta,
    isLoading: leavesQuery.isLoading,
    error: leavesQuery.error,

    requestLeave: requestLeaveMutation.mutateAsync,
    isRequesting: requestLeaveMutation.isPending,

    updateLeaveStatus: updateLeaveStatusMutation.mutateAsync,
    isUpdatingStatus: updateLeaveStatusMutation.isPending,

    deleteLeave: deleteLeaveMutation.mutateAsync,
    isDeleting: deleteLeaveMutation.isPending,
  };
};
