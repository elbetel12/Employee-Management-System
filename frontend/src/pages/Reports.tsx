import React, { useState } from 'react';
import { useWorkHoursReport, exportWorkHoursReport } from '../hooks/useAnalytics';
import { useDepartments } from '../hooks/useDepartments';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileSpreadsheet,Loader2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [deptFilter, setDeptFilter] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  // Departments for filter dropdown
  const { departments } = useDepartments();

  // Fetch report
  const { data: reportData, isLoading } = useWorkHoursReport({
    month,
    year,
    department: deptFilter || undefined,
  });

  // Calculate days in the selected month
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const daysCount = getDaysInMonth(month, year);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportWorkHoursReport({
        month,
        year,
        department: deptFilter || undefined,
      });
    } catch (err) {
      alert('Failed to export report to Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Work Hours Analytics</h2>
          <p className="text-muted-foreground">
            Track daily and monthly attendance hours worked across employees and departments.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting || isLoading || !reportData || reportData.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = currentYear - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>

          {user?.role === 'admin' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Data Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Roster Sheet</CardTitle>
          <CardDescription>
            Daily work hour logs for {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin text-primary" />
            </div>
          ) : reportData && reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 sticky left-0 bg-background z-10 border-r min-w-[180px]">Employee</th>
                    <th className="py-3 px-4 border-r min-w-[120px]">Department</th>
                    {daysArray.map((day) => (
                      <th key={day} className="py-3 px-2 text-center border-r min-w-[40px]">
                        {day}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-center font-bold bg-secondary/10">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((emp) => {
                    return (
                      <tr key={emp.employeeId} className="border-b hover:bg-secondary/10 transition-colors">
                        <td className="py-3 px-4 font-semibold sticky left-0 bg-background z-10 border-r min-w-[180px]">
                          {emp.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground border-r min-w-[120px]">
                          {emp.department}
                        </td>
                        {daysArray.map((day) => {
                          // Find matching day in dailyBreakdown
                          const daily = emp.dailyBreakdown.find((item) => {
                            const dateObj = new Date(item.date);
                            // Shift offset to compare in local TZ
                            return dateObj.getDate() === day;
                          });
                          const hours = daily ? daily.hours : 0;
                          return (
                            <td
                              key={day}
                              className={`py-3 px-1 text-center border-r font-medium ${
                                hours > 0
                                  ? 'text-primary dark:text-blue-400 bg-primary/5'
                                  : 'text-muted-foreground/45'
                              }`}
                            >
                              {hours > 0 ? hours.toFixed(1) : '-'}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-center font-bold bg-secondary/10 text-foreground">
                          {emp.totalHours.toFixed(1)} hrs
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No work hours records found for this period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
