import React, { useState } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Sparkles, Star, TrendingUp, X, Award } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const PerformancePage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [isOpen, setIsOpen] = useState(false);

  const {
    evaluations,
    meta,
    isLoading,
    evaluate,
  } = usePerformance({
    page,
    limit: 15,
    month: month || undefined,
    year: year || undefined,
  });

  const { employees } = useEmployees({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: '',
      comments: '',
    },
  });

  const onEvaluateSubmit = async (data: any) => {
    try {
      await evaluate({
        employeeId: data.employeeId,
        evaluation: { comments: data.comments },
      });
      alert('Evaluation submitted successfully. Rating was auto-calculated based on hours worked.');
      reset();
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating performance review.');
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {currentUser?.role === 'manager' ? 'Team Performance' : 'Performance Tracking'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.role === 'manager'
              ? 'Evaluate and review performance metrics for your department.'
              : 'Monitor team quality assurance, monthly ratings, and comment logs.'}
          </p>
        </div>
        {currentUser?.role !== 'employee' && (
          <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Evaluate Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value ? parseInt(e.target.value) : '')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">Select Year</label>
            <Input type="number" placeholder="e.g. 2026" value={year} onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')} />
          </div>
        </CardContent>
      </Card>

      {/* Evaluations list */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : evaluations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/20 text-muted-foreground font-semibold">
                    <th className="py-4 px-6">Employee</th>
                    <th className="py-4 px-6">Evaluation Period</th>
                    <th className="py-4 px-6">System Rating</th>
                    <th className="py-4 px-6">Assigned Comments</th>
                    <th className="py-4 px-6">Evaluated By</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((ev) => {
                    const emp = ev.employee as any;
                    const evalBy = ev.evaluatedBy as any;
                    return (
                      <tr key={ev._id} className="border-b hover:bg-secondary/15 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          {emp ? `${emp.firstName} ${emp.lastName}` : 'System user'}
                        </td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">
                          {new Date(0, ev.month - 1).toLocaleString('en-US', { month: 'short' })} {ev.year}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            {getRatingStars(ev.rating)}
                            <span className="ml-2 font-bold text-foreground">({ev.rating})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground max-w-xs truncate">{ev.comments || '-'}</td>
                        <td className="py-4 px-6 text-muted-foreground">{evalBy ? evalBy.email : 'System manager'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No evaluations found for current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluate Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card shadow-2xl relative">
            <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <CardHeader className="text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Submit Month Evaluation</CardTitle>
              <CardDescription>
                System automatically scores rating from the current month's logged hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onEvaluateSubmit)} className="space-y-4">
                <Select
                  label="Select Employee"
                  options={[
                    { value: '', label: 'Select roster member...' },
                    ...employees.map((e) => ({ value: e._id, label: `${e.firstName} ${e.lastName}` })),
                  ]}
                  {...register('employeeId', { required: 'Please specify the employee' })}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-foreground/80">Evaluation Comments</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="Enter review comments or remarks..."
                    {...register('comments')}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Commit Evaluation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default PerformancePage;
