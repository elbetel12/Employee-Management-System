import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface WorkHoursReportItem {
  employeeId: string;
  name: string;
  department: string;
  totalHours: number;
  dailyBreakdown: { date: string; hours: number }[];
}

export const useWorkHoursReport = (params: {
  month: number;
  year: number;
  department?: string;
}) => {
  return useQuery({
    queryKey: ['work-hours-report', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: WorkHoursReportItem[] }>(
        '/analytics/work-hours',
        { params }
      );
      return data.data;
    },
    enabled: !!params.month && !!params.year,
  });
};

export const exportWorkHoursReport = async (params: {
  month: number;
  year: number;
  department?: string;
}) => {
  const response = await apiClient.get('/analytics/work-hours/export', {
    params,
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `work_hours_report_${params.month}_${params.year}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
