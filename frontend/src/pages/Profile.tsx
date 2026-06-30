import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import { useEmployees } from '../hooks/useEmployees';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Shield, KeyRound, Calendar, Phone, MapPin, Building, Printer, UserCircle } from 'lucide-react';
import QRCode from 'react-qr-code';


export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { changePassword, isChangingPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'badge' | 'security'>('badge');

  // If user has linked employee, fetch full employee data
  const employeeId = typeof user?.employee === 'string'
    ? user.employee
    : (user?.employee as any)?._id;

  const { employees } = useEmployees({
    limit: 1,
  });

  // Find the current logged in employee's profile
  const employeeProfile = employees.find(emp => emp._id === employeeId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitPassword = async (data: any) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        alert("New passwords do not match.");
        return;
      }
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      alert('Password changed successfully.');
      reset();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating password.');
    }
  };

  // Compile JSON data for the QR badge scanning simulation
  const qrDataStr = employeeProfile
    ? JSON.stringify({
      id: employeeProfile._id,
      name: `${employeeProfile.firstName} ${employeeProfile.lastName}`,
      email: employeeProfile.email,
      department: typeof employeeProfile.department === 'object' ? (employeeProfile.department as any)?.name : employeeProfile.department,
      position: employeeProfile.position,
    })
    : user?.email || '';

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">
          View your employee record, retrieve your digital security QR badge, or update account security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Details Summary */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
              <UserCircle className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                {employeeProfile
                  ? `${employeeProfile.firstName} ${employeeProfile.lastName}`
                  : user?.email.split('@')[0]}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5 capitalize flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {user?.role} Role
              </p>
            </div>

            <div className="border-t pt-4 text-left space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Building className="w-4 h-4 text-primary" />
                <span>
                  <strong>Dept:</strong>{' '}
                  {employeeProfile
                    ? (typeof employeeProfile.department === 'object'
                      ? (employeeProfile.department as any)?.name
                      : employeeProfile.department)
                    : 'System Administrator'}
                </span>
              </div>
              {employeeProfile && (
                <>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <User className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Role:</strong> {employeeProfile.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Phone:</strong> {employeeProfile.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Address:</strong> {employeeProfile.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Hired:</strong> {new Date(employeeProfile.hireDate).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Tabs and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-muted">
            <button
              onClick={() => setActiveTab('badge')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'badge'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
         <QRCode value={qrDataStr} size={160} />              Digital QR Badge
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          </div>

          {activeTab === 'badge' ? (
            <Card className="print:border-none print:shadow-none">
              <CardHeader className="print:hidden">
                <CardTitle>Security Check-in Badge</CardTitle>
                <CardDescription>
                  This QR code can be scanned at the security portal to log attendance check-ins and check-outs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
                {/* Print area container for QR badge */}
                <div className="print-area p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 flex flex-col items-center space-y-4 max-w-sm w-full text-center">
                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <QRCode value={qrDataStr} size={160} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">
                      {employeeProfile
                        ? `${employeeProfile.firstName} ${employeeProfile.lastName}`
                        : user?.email}
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                      {employeeProfile ? employeeProfile.position : 'Administrator'}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {employeeProfile
                        ? (typeof employeeProfile.department === 'object'
                          ? (employeeProfile.department as any)?.name
                          : employeeProfile.department)
                        : 'System Admin'}
                    </p>
                  </div>
                </div>

                <Button onClick={handlePrintBadge} className="flex items-center gap-2 print:hidden">
                  <Printer className="w-4 h-4" />
                  Print QR Badge
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Account Credentials</CardTitle>
                <CardDescription>
                  Update your account password to ensure your account security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    error={errors.currentPassword?.message}
                    {...register('currentPassword', { required: 'Current password is required.' })}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    error={errors.newPassword?.message}
                    {...register('newPassword', {
                      required: 'New password is required.',
                      minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                    })}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', { required: 'Please confirm your new password.' })}
                  />
                  <Button type="submit" disabled={isChangingPassword} className="w-full mt-4">
                    {isChangingPassword ? 'Applying Changes...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
