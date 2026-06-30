import React, { useState } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Sparkles, Calendar, Edit3, CreditCard, X, Printer } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export const PayrollPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any | null>(null);

  const openInvoiceModal = (pr: any) => {
    setSelectedPayroll(pr);
    setIsInvoiceOpen(true);
  };

  const {
    payrolls,
    meta,
    isLoading,
    generatePayroll,
    updatePayroll,
  } = usePayroll({
    page,
    limit: 15,
    month: month || undefined,
    year: year || undefined,
  });

  const { register: registerGen, handleSubmit: handleGenSubmit } = useForm({
    defaultValues: { payDate: '' },
  });

  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm({
    defaultValues: { bonuses: 0, deductions: 0, taxes: 0 },
  });

  const onGenerateSubmit = async (data: { payDate: string }) => {
    try {
      const res = await generatePayroll(data);
      alert('Payroll batch generated successfully.');
      setIsGenerateOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error generating payroll.');
    }
  };

  const onEditSubmit = async (data: { bonuses: number; deductions: number; taxes: number }) => {
    try {
      await updatePayroll({
        id: selectedPayroll._id,
        updates: data,
      });
      setIsEditOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating payroll invoice.');
    }
  };

  const openEditModal = (pr: any) => {
    setSelectedPayroll(pr);
    resetEdit({
      bonuses: pr.bonuses,
      deductions: pr.deductions,
      taxes: pr.taxes,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {currentUser?.role === 'manager' ? 'Team Payroll' : 'Corporate Payroll'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.role === 'manager'
              ? 'View salary sheets for employees in your department.'
              : 'Manage salary calculation sheets, deductions, taxes, and bonuses.'}
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button onClick={() => setIsGenerateOpen(true)} className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Monthly Payroll
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

      {/* Payroll table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : payrolls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/20 text-muted-foreground font-semibold">
                    <th className="py-4 px-6">Employee</th>
                    <th className="py-4 px-6">Payment Period</th>
                    <th className="py-4 px-6">Base Earned</th>
                    <th className="py-4 px-6">Bonuses</th>
                    <th className="py-4 px-6">Deductions</th>
                    <th className="py-4 px-6">Taxes</th>
                    <th className="py-4 px-6">Net Take-Home</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((pr) => {
                    const emp = pr.employee as any;
                    return (
                      <tr key={pr._id} className="border-b hover:bg-secondary/15 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          {emp ? `${emp.firstName} ${emp.lastName}` : 'System user'}
                        </td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">
                          {new Date(0, pr.month - 1).toLocaleString('en-US', { month: 'short' })} {pr.year}
                        </td>
                        <td className="py-4 px-6">{formatCurrency(pr.baseSalary)}</td>
                        <td className="py-4 px-6 text-green-600 font-semibold">+{formatCurrency(pr.bonuses)}</td>
                        <td className="py-4 px-6 text-destructive font-semibold">-{formatCurrency(pr.deductions)}</td>
                        <td className="py-4 px-6 text-destructive font-semibold">-{formatCurrency(pr.taxes)}</td>
                        <td className="py-4 px-6 font-bold text-foreground">{formatCurrency(pr.netPay)}</td>
                        <td className="py-4 px-6 text-right flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openInvoiceModal(pr)} title="View/Print Invoice">
                            <Printer className="w-4 h-4 text-emerald-600" />
                          </Button>
                          {currentUser?.role === 'admin' && (
                            <Button size="sm" variant="ghost" onClick={() => openEditModal(pr)} title="Edit Payroll Invoice">
                              <Edit3 className="w-4 h-4 text-primary" />
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
              No payrolls found for current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Payroll batch modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-card shadow-2xl relative">
            <button onClick={() => setIsGenerateOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <CardHeader className="text-center">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>Batch Generate Payroll</CardTitle>
              <CardDescription>
                Initiate monthly calculations based on logged attendance hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenSubmit(onGenerateSubmit)} className="space-y-4">
                <Input label="Pay Period Date" type="date" {...registerGen('payDate', { required: true })} />
                <Button type="submit" className="w-full">
                  Generate Payroll Invoices
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Payroll values modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-card shadow-2xl relative">
            <button onClick={() => setIsEditOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle>Adjust Invoice Values</CardTitle>
              <CardDescription>
                Modify additions, taxes, or deduct amounts manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
                <Input label="Bonuses ($)" type="number" step="0.01" {...registerEdit('bonuses', { valueAsNumber: true })} />
                <Input label="Deductions ($)" type="number" step="0.01" {...registerEdit('deductions', { valueAsNumber: true })} />
                <Input label="Taxes ($)" type="number" step="0.01" {...registerEdit('taxes', { valueAsNumber: true })} />
                <Button type="submit" className="w-full mt-4">
                  Apply Adjustments
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {isInvoiceOpen && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card shadow-2xl relative p-6 space-y-6">
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Area Wrapper */}
            <div className="print-area p-4 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-primary">EMS Corporate Invoice</h3>
                  <p className="text-xs text-muted-foreground mt-1">Employee Management Portal</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-500/15 text-emerald-600 font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Paid Invoice
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    ID: INV-{selectedPayroll.year}-{selectedPayroll.month}-{selectedPayroll._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Invoice Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Billed To:</p>
                  <p className="font-bold text-foreground mt-1">
                    {selectedPayroll.employee?.firstName} {selectedPayroll.employee?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedPayroll.employee?.position}</p>
                  <p className="text-xs text-muted-foreground">{selectedPayroll.employee?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Period Info:</p>
                  <p className="font-bold text-foreground mt-1">
                    {new Date(0, selectedPayroll.month - 1).toLocaleString('en-US', { month: 'long' })} {selectedPayroll.year}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pay Date: {new Date(selectedPayroll.payDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Financial calculations table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b text-xs font-bold text-muted-foreground uppercase">
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2.5 px-4 font-medium">Base Salary (Earned)</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-foreground">
                        {formatCurrency(selectedPayroll.baseSalary)}
                      </td>
                    </tr>
                    <tr className="border-b text-green-600 bg-green-50/10">
                      <td className="py-2.5 px-4 font-medium">Bonuses & Additions</td>
                      <td className="py-2.5 px-4 text-right font-bold">
                        +{formatCurrency(selectedPayroll.bonuses)}
                      </td>
                    </tr>
                    <tr className="border-b text-destructive bg-destructive/5">
                      <td className="py-2.5 px-4 font-medium">Attendance Penalty Deductions</td>
                      <td className="py-2.5 px-4 text-right font-bold">
                        -{formatCurrency(selectedPayroll.deductions)}
                      </td>
                    </tr>
                    <tr className="border-b text-destructive bg-destructive/5">
                      <td className="py-2.5 px-4 font-medium">Income Tax (20%)</td>
                      <td className="py-2.5 px-4 text-right font-bold">
                        -{formatCurrency(selectedPayroll.taxes)}
                      </td>
                    </tr>
                    <tr className="bg-secondary/20 font-bold text-base text-foreground">
                      <td className="py-3 px-4">Net Take-Home Salary</td>
                      <td className="py-3 px-4 text-right text-primary">
                        {formatCurrency(selectedPayroll.netPay)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature lines */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-xs">
                <div className="border-t pt-2 border-dashed">
                  <p className="text-muted-foreground text-center">Employee Signature</p>
                </div>
                <div className="border-t pt-2 border-dashed">
                  <p className="text-muted-foreground text-center">Authorized Finance Rep</p>
                </div>
              </div>
            </div>

            {/* Print Trigger Button */}
            <div className="flex justify-end gap-3 print:hidden pt-4 border-t">
              <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>
                Close Window
              </Button>
              <Button onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Pay Slip
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default PayrollPage;
