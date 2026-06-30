import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuthStore } from '../store/authStore';
import { useEmployees } from '../hooks/useEmployees';
import { useLeaves } from '../hooks/useLeaves';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  Users,
  Building2,
  CalendarCheck2,
  Hourglass,
  BadgeCent,
  Star,
  Activity,
  ClipboardList,
  TrendingUp,
  UserCircle,
  LogIn,
  ShieldCheck,
  UserCog,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

// ─── Personal dashboard for regular employees ────────────────────────────────
const EmployeeDashboard: React.FC<{ user: { name?: string; email?: string; role?: string } }> = ({ user }) => {
  const displayName = user?.name ?? user?.email ?? "Employee";

  const quickLinks = [
    {
      to: '/attendance',
      label: 'My Attendance',
      icon: CalendarCheck2,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      to: '/leaves',
      label: 'My Leaves',
      icon: ClipboardList,
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      to: '/performance',
      label: 'My Performance',
      icon: TrendingUp,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's a summary of your personal workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold">
          <UserCircle className="w-4 h-4" />
          Employee Portal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map(({ to, label, icon: Icon, color }) => (
          <Link to={to} key={to}>
            <Card className="hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-base">{label}</p>
                  <p className="text-xs text-muted-foreground">View your records</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Check In / Check Out
            </CardTitle>
            <CardDescription>
              Use the QR scanner on the Attendance page to record your daily check-in and check-out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/attendance">
              <Button className="w-full">Go to Attendance</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Request Leave
            </CardTitle>
            <CardDescription>
              Submit a new leave application and track the status of your existing requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/leaves">
              <Button variant="outline" className="w-full">Go to Leaves</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ─── Department Head dashboard ───────────────────────────────────────────────
const ManagerDashboard: React.FC<{ user: { name?: string; email?: string; role?: string } }> = ({ user }) => {
  const displayName = user?.name ?? user?.email ?? 'Manager';
  const { employees, isLoading: empLoading } = useEmployees({ limit: 100 });
  const { leaves, isLoading: leaveLoading } = useLeaves({ limit: 100, status: 'Pending' });

  const teamCount = employees.length;
  const pendingLeaves = leaves.length;

  const quickLinks = [
    { to: '/employees', label: 'My Team', desc: 'View department roster', icon: Users, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { to: '/attendance', label: 'Team Attendance', desc: 'Monitor check-ins', icon: CalendarCheck2, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { to: '/leaves', label: 'Leave Approvals', desc: `${pendingLeaves} pending`, icon: ClipboardList, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
    { to: '/performance', label: 'Performance Reviews', desc: 'Evaluate team', icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { to: '/payrolls', label: 'Payroll Overview', desc: 'View salary sheets', icon: BadgeCent, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { to: '/departments', label: 'Department Info', desc: 'View details', icon: Building2, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Department Head Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome back, {displayName.split(' ')[0]}. Here's an overview of your team.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ring-indigo-700/10">
          <ShieldCheck className="w-4 h-4" />
          Department Head
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Team Members</p>
              <h3 className="text-3xl font-bold tracking-tight">{empLoading ? '...' : teamCount}</h3>
              <p className="text-xs text-muted-foreground font-semibold">Active employees in your department</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Pending Leaves</p>
              <h3 className="text-3xl font-bold tracking-tight">{leaveLoading ? '...' : pendingLeaves}</h3>
              <p className="text-xs text-amber-600 font-semibold">Requires your approval</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Your Role</p>
              <h3 className="text-xl font-bold tracking-tight">Department Head</h3>
              <p className="text-xs text-muted-foreground font-semibold">Manage your team operations</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <UserCog className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ to, label, desc, icon: Icon, color }) => (
            <Link to={to} key={to}>
              <Card className="hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Team Members */}
      {!empLoading && employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
            <CardDescription>Employees in your department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 8).map((emp) => (
                    <tr key={emp._id} className="border-b hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        {emp.firstName} {emp.lastName}
                        {emp.isDepartmentHead && (
                          <span className="ml-2 bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            Head
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{emp.position}</td>
                      <td className="py-3 px-4 text-muted-foreground">{emp.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{emp.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {employees.length > 8 && (
              <div className="pt-4 text-center">
                <Link to="/employees">
                  <Button variant="outline" size="sm">View All {teamCount} Members</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ─── Full admin dashboard ────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { user } = useAuthStore();

  // Employees get a personal dashboard
  if (user?.role === 'employee') {
    return <EmployeeDashboard user={user as { name?: string; email?: string; role?: string }} />;
  }

  // Managers get a department head dashboard
  if (user?.role === 'manager') {
    return <ManagerDashboard user={user as { name?: string; email?: string; role?: string }} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-xl text-destructive max-w-xl mx-auto">
        <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
        <p>Could not retrieve system metrics. Please ensure backend services are active.</p>
      </div>
    );
  }

  const chartData = stats.employeesByDepartment.map((d) => ({
    name: d.name,
    count: d.count,
  }));

  const pieData = stats.leaveStatusBreakdown.map((l) => ({
    name: l.status,
    value: l.count,
  }));

  const PIE_COLORS: Record<string, string> = {
    Pending: '#fbbf24',
    Approved: '#10b981',
    Rejected: '#ef4444',
    Cancelled: '#6b7280',
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Overview Dashboard</h2>
          <p className="text-muted-foreground">
            System performance, attendance rates, and operation metrics.
          </p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex gap-3">
            <Link to="/payrolls">
              <Button variant="outline" className="flex items-center gap-2">
                <BadgeCent className="w-4 h-4" />
                Generate Payrolls
              </Button>
            </Link>
            <Link to="/attendance">
              <Button className="flex items-center gap-2 shadow-md shadow-primary/10">
                <Activity className="w-4 h-4" />
                Attendance Log
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Employees</p>
              <h3 className="text-3xl font-bold tracking-tight">{stats.totalEmployees}</h3>
              <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                <span>+{stats.newHiresThisMonth}</span>
                <span className="text-muted-foreground">new this month</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Departments</p>
              <h3 className="text-3xl font-bold tracking-tight">{stats.totalDepartments}</h3>
              <p className="text-xs text-muted-foreground font-semibold">Active operational depts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Present Today</p>
              <h3 className="text-3xl font-bold tracking-tight">{stats.presentToday}</h3>
              <p className="text-xs text-muted-foreground font-semibold">
                {stats.totalEmployees > 0
                  ? `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)}% attendance rate`
                  : 'No employees'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shadow-inner">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.01] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avg Rating</p>
              <h3 className="text-3xl font-bold tracking-tight">{stats.avgPerformanceRating} / 5</h3>
              <p className="text-xs text-muted-foreground font-semibold">Monthly performance level</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Star className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Headcount</CardTitle>
            <CardDescription>Number of active employees scoped by department</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No departmental metrics.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Breakdown</CardTitle>
            <CardDescription>Distribution of leave application status</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-between">
            {pieData.length > 0 ? (
              <>
                <div className="flex-1 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] ?? COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[d.name] ?? COLORS[i % COLORS.length] }} />
                      <span>{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No leave request history.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Hires</CardTitle>
            <CardDescription>Newly onboarded employees in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentHires.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-semibold">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentHires.map((hire, idx) => (
                      <tr key={idx} className="border-b hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{hire.name}</td>
                        <td className="py-3 px-4">{hire.department}</td>
                        <td className="py-3 px-4 text-muted-foreground">{hire.position}</td>
                        <td className="py-3 px-4 text-muted-foreground">{new Date(hire.hireDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent hires found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle>Status Feed</CardTitle>
              <CardDescription>Real-time corporate notifications</CardDescription>
            </div>
            <Hourglass className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b">
              <span className="text-sm font-medium">Pending Leaves</span>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {stats.pendingLeaves} Required Action
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b">
              <span className="text-sm font-medium">Monthly Payroll Total</span>
              <span className="font-bold text-foreground">{formatCurrency(stats.monthlyPayrollTotal)}</span>
            </div>
            <div className="pt-2">
              <Link to="/leaves">
                <Button variant="outline" className="w-full text-xs font-semibold">Review Approvals</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
