import { Request, Response } from 'express';
import Employee, { IEmployee } from '../models/Employee';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find({})
      .populate('department', 'department_name')
      .populate('user', 'username email role');
    
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get employees by department
// @route   GET /api/employees/department/:id
// @access  Private
export const getEmployeesByDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const employees = await Employee.find({ department: id })
      .populate('department', 'department_name')
      .populate('user', 'username email role');
    
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'department_name')
      .populate('user', 'username email role');
    
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req: Request, res: Response) => {
  const {
    user_id,
    first_name,
    last_name,
    dob,
    gender,
    address,
    phone,
    email,
    position,
    department,
    hire_date,
    salary,
    is_department_head,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create QR code for the employee (used for attendance)
    const qrData = JSON.stringify({
      id: new mongoose.Types.ObjectId(),
      email,
      name: `${first_name} ${last_name}`
    });
    
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // Create the employee
    const employee = await Employee.create([{
      user: user_id,
      first_name,
      last_name,
      dob,
      gender,
      address,
      phone,
      email,
      position,
      department,
      hire_date,
      salary,
      is_department_head: is_department_head || false,
      qr_code_image: qrCodeImage
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(employee[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    dob,
    gender,
    address,
    phone,
    email,
    position,
    department,
    salary,
    is_department_head,
    is_active
  } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.first_name = first_name || employee.first_name;
      employee.last_name = last_name || employee.last_name;
      employee.dob = dob || employee.dob;
      employee.gender = gender || employee.gender;
      employee.address = address || employee.address;
      employee.phone = phone || employee.phone;
      employee.email = email || employee.email;
      employee.position = position || employee.position;
      employee.department = department || employee.department;
      employee.salary = salary || employee.salary;
      employee.is_department_head = is_department_head !== undefined ? is_department_head : employee.is_department_head;
      employee.is_active = is_active !== undefined ? is_active : employee.is_active;

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const employee = await Employee.findById(req.params.id).session(session);

    if (employee) {
      if (employee.user) {
        // Also set the associated user to inactive or delete it
        await User.findByIdAndUpdate(
          employee.user, 
          { $set: { is_active: false } },
          { session }
        );
      }
      
      await employee.deleteOne({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      res.json({ message: 'Employee removed' });
    } else {
      await session.abortTransaction();
      session.endSession();
      
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 