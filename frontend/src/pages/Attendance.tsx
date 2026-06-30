import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CalendarCheck, ArrowRightLeft, X, Plus } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export const AttendancePage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [page] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [empFilter, setEmpFilter] = useState('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const {
    records,
    isLoading,
    scanQr,
    manualLog,
  } = useAttendance({
    page,
    limit: 15,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    employeeId: empFilter || undefined,
  });

  const { employees } = useEmployees({ limit: 100 });

  // QR check form
  const {
    register: registerQr,
    handleSubmit: handleQrSubmit,
    reset: resetQr,
    formState: { errors: qrErrors },
  } = useForm({
    defaultValues: { email: '' },
  });

  // Manual log form
  const {
    register: registerManual,
    handleSubmit: handleManualSubmit,
    reset: resetManual,
    formState: { errors: manualErrors },
  } = useForm({
    defaultValues: {
      employeeId: '',
      date: '',
      checkIn: '',
      checkOut: '',
    },
  });

  const onQrScanSubmit = async (data: { email: string }) => {
    try {
      const res = await scanQr(data);
      alert(res.message);
      resetQr();
      setIsQrOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error checking in.');
    }
  };

  const onManualLogSubmit = async (data: any) => {
    try {
      const payload = {
        employeeId: data.employeeId,
        date: data.date || undefined,
        checkIn: data.checkIn ? new Date(`${data.date}T${data.checkIn}`).toISOString() : undefined,
        checkOut: data.checkOut ? new Date(`${data.date}T${data.checkOut}`).toISOString() : undefined,
      };
      await manualLog(payload);
      resetManual();
      setIsManualOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error logging attendance.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Attendance Logging</h2>
          <p className="text-muted-foreground">Monitor daily check-ins, check-outs, work durations, and QR scans.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsQrOpen(true)} className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Scan QR Check-In
          </Button>
          {currentUser?.role !== 'employee' && (
            <Button onClick={() => setIsManualOpen(true)} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Manual Entry
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className={`p-4 grid grid-cols-1 gap-4 ${currentUser?.role === 'employee' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          {currentUser?.role !== 'employee' && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Filter Employee</label>
              <select
                value={empFilter}
                onChange={(e) => setEmpFilter(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <option value="">All Employees</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/20 text-muted-foreground font-semibold">
                    <th className="py-4 px-6">Employee</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Check In</th>
                    <th className="py-4 px-6">Check Out</th>
                    <th className="py-4 px-6">Duration (Hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const emp = r.employee as any;
                    const cIn = r.checkIn ? new Date(r.checkIn) : null;
                    const cOut = r.checkOut ? new Date(r.checkOut) : null;
                    const duration = cIn && cOut ? ((cOut.getTime() - cIn.getTime()) / 3600000).toFixed(2) : '-';

                    return (
                      <tr key={r._id} className="border-b hover:bg-secondary/10 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          {emp ? `${emp.firstName} ${emp.lastName}` : 'System user'}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{formatDate(r.date)}</td>
                        <td className="py-4 px-6 font-medium text-green-600">
                          {cIn ? cIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="py-4 px-6 font-medium text-amber-600">
                          {cOut ? cOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="py-4 px-6 font-bold">{duration} hrs</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No attendance records found for current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Scanner simulation Modal */}
      {isQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-card shadow-2xl relative">
            <button
              onClick={() => setIsQrOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader className="text-center">
              <CardTitle>Scan Portal QR Badge</CardTitle>
              <CardDescription>
                Simulate badge reader by inputting the employee's active email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQrSubmit(onQrScanSubmit)} className="space-y-4">
                <div className="border border-dashed border-primary/40 rounded-xl p-8 bg-primary/5 flex flex-col items-center justify-center space-y-4">
                  <CalendarCheck className="w-16 h-16 text-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                    Simulating Camera Feed...
                  </span>
                </div>
                <Input
                  label="Employee Email Address"
                  type="email"
                  placeholder="e.g. employee@company.com"
                  error={qrErrors.email?.message}
                  {...registerQr('email', { required: 'Email address is required to check-in.' })}
                />
                <Button type="submit" className="w-full">
                  Trigger Scan Check
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card shadow-2xl relative">
            <button
              onClick={() => setIsManualOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle>Add Manual Log</CardTitle>
              <CardDescription>
                Log physical check-ins/outs on behalf of an employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit(onManualLogSubmit)} className="space-y-4">
                <Select
                  label="Select Employee"
                  options={[
                    { value: '', label: 'Select roster member...' },
                    ...employees.map((e) => ({ value: e._id, label: `${e.firstName} ${e.lastName}` })),
                  ]}
                  {...registerManual('employeeId', { required: 'Please pick an employee' })}
                />
                <Input
                  label="Log Date"
                  type="date"
                  error={manualErrors.date?.message}
                  {...registerManual('date', { required: 'Please specify the date' })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Check In Time" type="time" {...registerManual('checkIn')} />
                  <Input label="Check Out Time" type="time" {...registerManual('checkOut')} />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Submit Attendance Record
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default AttendancePage;
