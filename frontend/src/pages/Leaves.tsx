import React, { useState } from 'react';
import { useLeaves } from '../hooks/useLeaves';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Plus, X, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export const LeavesPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState<'Pending' | 'Approved' | 'Rejected' | ''>('');
  const [isOpen, setIsOpen] = useState(false);

  const {
    leaves,
    isLoading,
    requestLeave,
    updateLeaveStatus,
  } = useLeaves({
    page,
    limit: 10,
    status: statusTab || undefined,
  });

  const { employees } = useEmployees({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: currentUser?.employee && typeof currentUser.employee === 'string' ? currentUser.employee : '',
      leaveType: 'Annual',
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const onLeaveSubmit = async (data: any) => {
    try {
      const payload = {
        employeeId: currentUser?.employee && typeof currentUser.employee === 'string' ? currentUser.employee : data.employeeId,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason || undefined,
      };
      await requestLeave(payload);
      reset();
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating leave request.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateLeaveStatus({ id, status: newStatus });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating status.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {currentUser?.role === 'manager' ? 'Team Leave Approvals' : 'Leave Approvals'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.role === 'manager'
              ? 'Review and approve leave requests from your department.'
              : 'Manage employee time-off, applications, and status updates.'}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Request Leave
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-3">
        {[
          { label: 'All Requests', value: '' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Approved', value: 'Approved' },
          { label: 'Rejected', value: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatusTab(tab.value as any);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              statusTab === tab.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roster Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : leaves.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/20 text-muted-foreground font-semibold">
                    <th className="py-4 px-6">Employee</th>
                    <th className="py-4 px-6">Leave Type</th>
                    <th className="py-4 px-6">Start Date</th>
                    <th className="py-4 px-6">End Date</th>
                    <th className="py-4 px-6">Reason</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => {
                    const emp = leave.employee as any;
                    return (
                      <tr key={leave._id} className="border-b hover:bg-secondary/15 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          {emp ? `${emp.firstName} ${emp.lastName}` : 'System user'}
                        </td>
                        <td className="py-4 px-6 font-medium text-foreground">{leave.leaveType}</td>
                        <td className="py-4 px-6 text-muted-foreground">{formatDate(leave.startDate)}</td>
                        <td className="py-4 px-6 text-muted-foreground">{formatDate(leave.endDate)}</td>
                        <td className="py-4 px-6 text-muted-foreground max-w-xs truncate">{leave.reason || '-'}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${
                              leave.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 ring-amber-600/20'
                                : leave.status === 'Approved'
                                  ? 'bg-green-50 text-green-800 ring-green-600/20'
                                  : 'bg-red-50 text-red-800 ring-red-600/20'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {currentUser?.role !== 'employee' && leave.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(leave._id, 'Approved')}
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(leave._id, 'Rejected')}
                              >
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          {currentUser?.role === 'employee' && leave.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(leave._id, 'Cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No leave requests in this category.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Leave Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader className="text-center">
              <CalendarCheck className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Request Leave Time-Off</CardTitle>
              <CardDescription>
                Submit date ranges and type of leave for administrative validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onLeaveSubmit)} className="space-y-4">
                {currentUser?.role !== 'employee' && (
                  <Select
                    label="On Behalf of Employee"
                    options={[
                      { value: '', label: 'Select employee...' },
                      ...employees.map((e) => ({ value: e._id, label: `${e.firstName} ${e.lastName}` })),
                    ]}
                    {...register('employeeId', { required: 'Please specify the employee' })}
                  />
                )}
                <Select
                  label="Leave Type"
                  options={[
                    { value: 'Sick', label: 'Sick Leave' },
                    { value: 'Vacation', label: 'Vacation' },
                    { value: 'Maternity', label: 'Maternity' },
                    { value: 'Paternity', label: 'Paternity' },
                    { value: 'Unpaid', label: 'Unpaid Leave' },
                    { value: 'Annual', label: 'Annual Leave' },
                    { value: 'Casual', label: 'Casual Leave' },
                    { value: 'Education', label: 'Education' },
                  ]}
                  {...register('leaveType')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    error={errors.startDate?.message}
                    {...register('startDate', { required: 'Start date is required' })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    error={errors.endDate?.message}
                    {...register('endDate', { required: 'End date is required' })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-foreground/80">Reason</label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="Enter reason for leave..."
                    {...register('reason')}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default LeavesPage;
