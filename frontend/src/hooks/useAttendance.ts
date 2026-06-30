import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Attendance, PaginatedResponse } from '../types';

export const useAttendance = (params: {
  page?: number;
  limit?: number;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
} = {}) => {
  const queryClient = useQueryClient();

  const attendanceQuery = useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Attendance>>('/attendance', {
        params,
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const scanQrMutation = useMutation({
    mutationFn: async (qrData: { email: string }) => {
      const { data } = await apiClient.post('/attendance/qr', qrData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const manualLogMutation = useMutation({
    mutationFn: async (log: {
      employeeId: string;
      date?: string;
      checkIn?: string;
      checkOut?: string;
    }) => {
      const { data } = await apiClient.post('/attendance/manual', log);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { checkIn?: string; checkOut?: string };
    }) => {
      const { data } = await apiClient.patch(`/attendance/${id}`, updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  return {
    records: attendanceQuery.data?.data ?? [],
    meta: attendanceQuery.data?.meta,
    isLoading: attendanceQuery.isLoading,
    error: attendanceQuery.error,

    scanQr: scanQrMutation.mutateAsync,
    isScanning: scanQrMutation.isPending,

    manualLog: manualLogMutation.mutateAsync,
    isLogging: manualLogMutation.isPending,

    updateAttendance: updateAttendanceMutation.mutateAsync,
    isUpdating: updateAttendanceMutation.isPending,
  };
};
