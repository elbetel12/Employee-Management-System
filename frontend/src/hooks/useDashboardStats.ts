import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { DashboardStats } from '../types';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: DashboardStats }>('/analytics/dashboard');
      return data.data;
    },
  });
};
