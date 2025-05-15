import { Request, Response } from 'express';
import Payroll from '../models/Payroll';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';

// @desc    Get all payrolls
// @route   GET /api/payrolls
// @access  Private/Admin
export const getPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await Payroll.find({})
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .sort({ pay_date: -1 });
    
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get payrolls by employee
// @route   GET /api/payrolls/employee/:id
// @access  Private
export const getPayrollsByEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const payrolls = await Payroll.find({ employee: id })
      .sort({ pay_date: -1 });
    
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get payrolls by month/year
// @route   GET /api/payrolls/monthly
// @access  Private/Admin
export const getPayrollsByMonth = async (req: Request, res: Response) => {
  const { month, year } = req.query;
  
  try {
    const payrolls = await Payroll.find({
      month: Number(month),
      year: Number(year)
    })
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      });
    
    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get payroll by ID
// @route   GET /api/payrolls/:id
// @access  Private
export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      });
    
    if (payroll) {
      res.json(payroll);
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a payroll
// @route   POST /api/payrolls
// @access  Private/Admin
export const createPayroll = async (req: Request, res: Response) => {
  const {
    employeeId,
    pay_date,
    month,
    year,
    base_salary,
    bonuses,
    deductions,
    taxes
  } = req.body;
  
  try {
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check if payroll already exists for this month/year
    const existingPayroll = await Payroll.findOne({
      employee: employeeId,
      month: month || (new Date(pay_date)).getMonth() + 1,
      year: year || (new Date(pay_date)).getFullYear()
    });
    
    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already exists for this month/year' });
    }
    
    // Create payroll
    const payroll = await Payroll.create({
      employee: employeeId,
      pay_date: new Date(pay_date),
      month: month || undefined,
      year: year || undefined,
      base_salary: base_salary || employee.salary,
      bonuses: bonuses || 0,
      deductions: deductions || 0,
      taxes: taxes || 0
    });
    
    res.status(201).json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a payroll
// @route   PUT /api/payrolls/:id
// @access  Private/Admin
export const updatePayroll = async (req: Request, res: Response) => {
  const {
    pay_date,
    base_salary,
    bonuses,
    deductions,
    taxes
  } = req.body;
  
  try {
    const payroll = await Payroll.findById(req.params.id);
    
    if (payroll) {
      if (pay_date) {
        payroll.pay_date = new Date(pay_date);
        payroll.month = new Date(pay_date).getMonth() + 1;
        payroll.year = new Date(pay_date).getFullYear();
      }
      
      payroll.base_salary = base_salary !== undefined ? base_salary : payroll.base_salary;
      payroll.bonuses = bonuses !== undefined ? bonuses : payroll.bonuses;
      payroll.deductions = deductions !== undefined ? deductions : payroll.deductions;
      payroll.taxes = taxes !== undefined ? taxes : payroll.taxes;
      
      // Net pay will be recalculated automatically via the pre-save hook
      
      const updatedPayroll = await payroll.save();
      res.json(updatedPayroll);
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a payroll
// @route   DELETE /api/payrolls/:id
// @access  Private/Admin
export const deletePayroll = async (req: Request, res: Response) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    
    if (payroll) {
      await payroll.deleteOne();
      res.json({ message: 'Payroll removed' });
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate payrolls for a month
// @route   POST /api/payrolls/generate
// @access  Private/Admin
export const generatePayrolls = async (req: Request, res: Response) => {
  const { month, year, deductionRate, taxRate } = req.body;
  
  try {
    // Get all active employees
    const employees = await Employee.find({ is_active: true });
    
    // Start date of month
    const startDate = new Date(year, month - 1, 1);
    
    // End date of month (1st day of next month)
    const endDate = new Date(year, month, 1);
    
    const results = [];
    
    for (const employee of employees) {
      // Check if payroll already exists for this employee this month
      const existingPayroll = await Payroll.findOne({
        employee: employee._id,
        month,
        year
      });
      
      if (existingPayroll) {
        results.push({
          employee: employee._id,
          status: 'Skipped',
          message: 'Payroll already exists'
        });
        continue;
      }
      
      // Calculate work hours for attendance calculation
      const attendances = await Attendance.find({
        employee: employee._id,
        date: { $gte: startDate, $lt: endDate },
        check_in: { $exists: true },
        check_out: { $exists: true }
      });
      
      // Get total hours worked for bonus calculation or no-work deduction
      let totalHoursWorked = 0;
      attendances.forEach(attendance => {
        const checkIn = new Date(attendance.check_in as Date);
        const checkOut = new Date(attendance.check_out as Date);
        const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        totalHoursWorked += hoursWorked;
      });
      
      // Assuming 8 hours per day, 22 working days per month
      const expectedMonthlyHours = 8 * 22;
      
      // Bonus for overtime (1.5x rate for hours over expected)
      let bonuses = 0;
      if (totalHoursWorked > expectedMonthlyHours) {
        const overtimeHours = totalHoursWorked - expectedMonthlyHours;
        const hourlyRate = employee.salary / expectedMonthlyHours;
        bonuses = overtimeHours * hourlyRate * 0.5; // 50% extra for overtime
      }
      
      // Deductions for under-time (proportional to missing hours)
      let deductions = 0;
      if (totalHoursWorked < expectedMonthlyHours) {
        const missingHours = expectedMonthlyHours - totalHoursWorked;
        const hourlyRate = employee.salary / expectedMonthlyHours;
        deductions = missingHours * hourlyRate * deductionRate;
      }
      
      // Calculate taxes
      const taxes = employee.salary * taxRate;
      
      // Create payroll
      const payroll = await Payroll.create({
        employee: employee._id,
        pay_date: new Date(year, month - 1, 28), // Pay date on the 28th
        month,
        year,
        base_salary: employee.salary,
        bonuses,
        deductions,
        taxes
      });
      
      results.push({
        employee: employee._id,
        status: 'Success',
        payroll: payroll._id
      });
    }
    
    res.status(201).json({
      message: `Generated ${results.filter(r => r.status === 'Success').length} payrolls`,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 