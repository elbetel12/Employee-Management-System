import React, { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Plus, Search, Edit, Trash2, X, Building2, User } from 'lucide-react';
import type { Department } from '../types';
import { useAuthStore } from '../store/authStore';

export const Departments: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const {
    departments,
    isLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments({ search });

  // Get active employees to select as department head
  const { employees } = useEmployees({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      head: '',
    },
  });

  const openCreateModal = () => {
    setEditingDept(null);
    reset({
      name: '',
      description: '',
      head: '',
    });
    setIsOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    reset({
      name: dept.name,
      description: dept.description,
      head: typeof dept.head === 'object' ? dept.head?._id : dept.head || '',
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        head: data.head || undefined,
      };

      if (editingDept) {
        await updateDepartment({ id: editingDept._id, updates: payload });
      } else {
        await createDepartment(payload);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error occurred while saving department.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error deleting department.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {currentUser?.role === 'manager' ? 'My Department' : 'Departments'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.role === 'manager'
              ? 'View your department information and team structure.'
              : 'Manage organization units, descriptions, and department heads.'}
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept._id} className="flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg text-primary flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {currentUser?.role === 'admin' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(dept)}>
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept._id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-bold">{dept.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{dept.description}</CardDescription>
              </CardHeader>
              <CardContent className="border-t pt-4 bg-secondary/5 mt-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Head of Dept:</span>
                  {dept.head && typeof dept.head === 'object' ? (
                    <span className="text-foreground font-medium">
                      {(dept.head as any).firstName} {(dept.head as any).lastName}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">None Assigned</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground text-sm bg-card rounded-lg border">
          No departments found.
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardHeader>
              <CardTitle>{editingDept ? 'Edit Department' : 'Create New Department'}</CardTitle>
              <CardDescription>
                Define operational group settings and pick a head.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Department Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-foreground/85">Description</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="Describe the department responsibilities..."
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
                <Select
                  label="Department Head"
                  options={[
                    { value: '', label: 'Select Employee (Optional)' },
                    ...employees.map((e) => ({
                      value: e._id,
                      label: `${e.firstName} ${e.lastName} - ${e.position}`,
                    })),
                  ]}
                  {...register('head')}
                />
                <Button type="submit" className="w-full mt-4">
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default Departments;
