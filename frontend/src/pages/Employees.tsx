import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Plus, Search, Eye, Edit, Trash2, X, QrCode } from 'lucide-react';
import { QRCode } from 'react-qr-code';
import type { Employee, Gender } from '../types';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export const Employees: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);

  const {
    employees,
    meta,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees({
    page,
    limit: 10,
    search,
    department: deptFilter,
  });

  const { departments } = useDepartments();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male' as Gender,
      address: '',
      phone: '',
      email: '',
      position: '',
      department: '',
      hireDate: '',
      salary: 0,
      isDepartmentHead: false,
    },
  });

  const openCreateModal = () => {
    setEditingEmployee(null);
    reset({
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      address: '',
      phone: '',
      email: '',
      position: '',
      department: departments[0]?._id || '',
      hireDate: '',
      salary: 0,
      isDepartmentHead: false,
    });
    setIsOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    reset({
      firstName: emp.firstName,
      lastName: emp.lastName,
      dob: emp.dob ? emp.dob.split('T')[0] : '',
      gender: emp.gender,
      address: emp.address,
      phone: emp.phone,
      email: emp.email,
      position: emp.position,
      department: typeof emp.department === 'object' ? emp.department._id : emp.department,
      hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
      salary: emp.salary,
      isDepartmentHead: emp.isDepartmentHead,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingEmployee) {
        await updateEmployee({ id: editingEmployee._id, updates: data });
      } else {
        await createEmployee(data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error occurred while saving employee record.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this employee? This will also disable their user account.')) {
      try {
        await deleteEmployee(id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error deleting employee.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">
            {currentUser?.role === 'manager' ? 'My Department Team' : 'Employees'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.role === 'manager'
              ? 'View and manage employees in your department.'
              : 'Manage corporate roster details, salaries, and system accounts.'}
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {currentUser?.role === 'admin' && (
            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex h-10 w-full md:w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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

      {/* Roster Grid */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-secondary/20 text-muted-foreground font-semibold">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email / Phone</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Position</th>
                    <th className="py-4 px-6">Hire Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="border-b hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">
                        {emp.firstName} {emp.lastName}
                        {emp.isDepartmentHead && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            Head
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        <div className="text-foreground font-medium">{emp.email}</div>
                        <div>{emp.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        {typeof emp.department === 'object' ? emp.department.name : emp.department}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground font-medium">{emp.position}</td>
                      <td className="py-4 px-6 text-muted-foreground">{formatDate(emp.hireDate)}</td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQrEmployee(emp)}
                          title="View QR Badge"
                        >
                          <QrCode className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(emp)}
                          disabled={currentUser?.role !== 'admin' && currentUser?.role !== 'manager'}
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        {currentUser?.role === 'admin' && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(emp._id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No employees matched the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-2 border-t bg-card rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
            disabled={page === meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-card shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle>{editingEmployee ? 'Edit Employee Info' : 'Create New Employee'}</CardTitle>
              <CardDescription>
                Provide organizational information to register or update the employee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
                  <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email Address" type="email" error={errors.email?.message} {...register('email')} />
                  <Input label="Phone Number" error={errors.phone?.message} {...register('phone')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date of Birth" type="date" error={errors.dob?.message} {...register('dob')} />
                  <Select
                    label="Gender"
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                    {...register('gender')}
                  />
                </div>
                <Input label="Residential Address" error={errors.address?.message} {...register('address')} />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    options={departments.map((d) => ({ value: d._id, label: d.name }))}
                    {...register('department')}
                  />
                  <Input label="Corporate Position" error={errors.position?.message} {...register('position')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date of Hire" type="date" error={errors.hireDate?.message} {...register('hireDate')} />
                  <Input label="Salary Rate ($)" type="number" step="0.01" error={errors.salary?.message} {...register('salary', { valueAsNumber: true })} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isHead" {...register('isDepartmentHead')} className="rounded border-gray-300 text-primary focus:ring-primary/50" />
                  <label htmlFor="isHead" className="text-sm font-semibold">
                    Set as Department Head
                  </label>
                </div>
                <Button type="submit" className="w-full mt-4">
                  {editingEmployee ? 'Update Roster' : 'Register Employee'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QR Code Modal */}
      {qrEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm bg-card shadow-2xl relative border-primary/20">
            <button
              onClick={() => setQrEmployee(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">{qrEmployee.firstName}'s Badge</CardTitle>
              <CardDescription>
                Scan this code to check in or out.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 pt-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <QRCode value={JSON.stringify({ email: qrEmployee.email })} size={220} />
              </div>
              <Button
                className="w-full font-bold"
                onClick={() => window.print()}
              >
                Print Badge
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default Employees;
