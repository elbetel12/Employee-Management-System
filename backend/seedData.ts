import 'dotenv/config';
import mongoose from 'mongoose';
import Department from './src/modules/departments/department.model';
import Employee from './src/modules/employees/employee.model';
import User from './src/modules/auth/user.model';
import Attendance from './src/modules/attendance/attendance.model';
import Leave from './src/modules/leave/leave.model';
import Payroll from './src/modules/payroll/payroll.model';
import { config } from './src/config/env';

// Dummy Data Arrays
const departmentsData = [
  { name: 'Engineering', description: 'Software Development and IT' },
  { name: 'Human Resources', description: 'HR and Employee Relations' },
  { name: 'Sales', description: 'Sales and Marketing' },
];

const employeesData = [
  { firstName: 'Abel', lastName: 'Tesfaye', gender: 'Male', position: 'Software Engineer', salary: 80000 },
  { firstName: 'Hana', lastName: 'Bekele', gender: 'Female', position: 'HR Manager', salary: 75000, isDepartmentHead: true },
  { firstName: 'Samuel', lastName: 'Alemu', gender: 'Male', position: 'Sales Representative', salary: 60000 },
  { firstName: 'Meron', lastName: 'Tadesse', gender: 'Female', position: 'Frontend Developer', salary: 70000 },
  { firstName: 'Yonas', lastName: 'Gebre', gender: 'Male', position: 'Backend Developer', salary: 75000 },
  { firstName: 'Bethlehem', lastName: 'Mekonnen', gender: 'Female', position: 'QA Engineer', salary: 65000 },
  { firstName: 'Dawit', lastName: 'Haile', gender: 'Male', position: 'HR Executive', salary: 50000 },
  { firstName: 'Selamawit', lastName: 'Assefa', gender: 'Female', position: 'Sales Manager', salary: 85000, isDepartmentHead: true },
  { firstName: 'Natnael', lastName: 'Worku', gender: 'Male', position: 'DevOps Engineer', salary: 90000 },
  { firstName: 'Rahel', lastName: 'Girma', gender: 'Female', position: 'System Administrator', salary: 65000 },
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected!');

    console.log('Clearing existing data (including dummy users)...');
    await Department.deleteMany({});
    await Employee.deleteMany({});
    // Delete all users except the main admin
    await User.deleteMany({ email: { $ne: 'admin@example.com' } });
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await Payroll.deleteMany({});

    console.log('Seeding Departments...');
    const createdDepartments = await Department.insertMany(departmentsData);
    const engDeptId = createdDepartments[0]._id;
    const hrDeptId = createdDepartments[1]._id;
    const salesDeptId = createdDepartments[2]._id;

    console.log('Seeding Employees...');
    const employeesWithDepts = employeesData.map((emp, index) => {
      let deptId;
      if (emp.position.includes('HR')) deptId = hrDeptId;
      else if (emp.position.includes('Sales')) deptId = salesDeptId;
      else deptId = engDeptId;

      return {
        ...emp,
        dob: new Date(1990, 0, (index % 28) + 1), // Dummy DOB
        address: `${100 + index} Main St, City`,
        phone: `555-010${index}`,
        email: `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}@example.com`,
        department: deptId,
        hireDate: new Date(2022, index % 12, 1),
      };
    });

    const createdEmployees = await Employee.insertMany(employeesWithDepts);

    console.log('Seeding Users...');
    for (const emp of createdEmployees) {
      const role = emp.isDepartmentHead ? 'manager' : 'employee';
      await User.create({
        email: emp.email,
        password: 'Password@123',
        role,
        employee: emp._id,
      });
    }

    console.log('Seeding Attendance, Leaves, and Payroll...');
    const attendanceRecords: any[] = [];
    const leaveRecords: any[] = [];
    const payrollRecords: any[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const emp of createdEmployees) {
      // 1. Create up to 5 days of attendance for each employee
      for (let i = 1; i <= 5; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        
        // Skip weekends
        if (d.getDay() !== 0 && d.getDay() !== 6) {
             const checkInDate = new Date(d);
             checkInDate.setHours(9, 0, 0, 0);
             const checkOutDate = new Date(d);
             checkOutDate.setHours(17, 30, 0, 0);

             attendanceRecords.push({
                employee: emp._id,
                date: d,
                checkIn: checkInDate,
                checkOut: checkOutDate,
             });
        }
      }

      // 2. Create 1 leave record for every other employee
      if (emp.salary % 2 === 0) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + 5); // 5 days from now
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);   // 7 days from now
        
        leaveRecords.push({
          employee: emp._id,
          leaveType: 'Annual',
          startDate,
          endDate,
          status: 'Approved',
          reason: 'Family vacation'
        });
      }

      // 3. Create 1 payroll record for last month
      const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
      const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      
      const baseSalary = Math.round(emp.salary / 12); // monthly base
      const taxes = Math.round(baseSalary * 0.2); // 20% tax
      const netPay = baseSalary - taxes;

      payrollRecords.push({
        employee: emp._id,
        payDate: new Date(year, lastMonth, 1),
        month: lastMonth,
        year: year,
        baseSalary,
        taxes,
        netPay
      });
    }

    if(attendanceRecords.length > 0) await Attendance.insertMany(attendanceRecords);
    if(leaveRecords.length > 0) await Leave.insertMany(leaveRecords);
    if(payrollRecords.length > 0) await Payroll.insertMany(payrollRecords);

    console.log('Database seeded successfully with sample records!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedData();
