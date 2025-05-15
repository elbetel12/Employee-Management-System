import { Request, Response } from 'express';
import Leave from '../models/Leave';
import Employee from '../models/Employee';
import Notification from '../models/Notification';
import mongoose from 'mongoose';

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private/Admin
export const getLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({})
      .populate({
        path: 'employee',
        select: 'first_name last_name department user',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get leave requests by employee
// @route   GET /api/leaves/employee/:id
// @access  Private
export const getLeavesByEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const leaves = await Leave.find({ employee: id })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get leave request by ID
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'first_name last_name department user',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      });
    
    if (leave) {
      res.json(leave);
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a leave request
// @route   POST /api/leaves
// @access  Private
export const createLeave = async (req: Request, res: Response) => {
  const { employeeId, leave_type, start_date, end_date, image } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify the employee exists
    const employee = await Employee.findById(employeeId)
      .populate('department')
      .populate('user');
    
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Create the leave request
    const leave = await Leave.create([{
      employee: employeeId,
      leave_type,
      start_date,
      end_date,
      image
    }], { session });

    // Create notification for managers/admins
    await Notification.create([{
      user: employee.user,
      message: `New leave request from ${employee.first_name} ${employee.last_name}`,
      leave: leave[0]._id
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(leave[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update leave request status
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin
export const updateLeaveStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'first_name last_name user'
      })
      .session(session);
    
    if (!leave) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    leave.status = status;
    const updatedLeave = await leave.save({ session });
    
    // Create notification for the employee
    if (leave.employee && (leave.employee as any).user) {
      await Notification.create([{
        user: (leave.employee as any).user,
        message: `Your leave request has been ${status.toLowerCase()}`,
        leave: leave._id
      }], { session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.json(updatedLeave);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a leave request
// @route   PUT /api/leaves/:id
// @access  Private
export const updateLeave = async (req: Request, res: Response) => {
  const { leave_type, start_date, end_date, image } = req.body;
  
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Check if leave can be updated (only pending leaves can be updated)
    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot update leave request that has already been processed' 
      });
    }
    
    leave.leave_type = leave_type || leave.leave_type;
    leave.start_date = start_date || leave.start_date;
    leave.end_date = end_date || leave.end_date;
    leave.image = image || leave.image;
    
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a leave request
// @route   DELETE /api/leaves/:id
// @access  Private
export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Check if leave can be deleted (only pending leaves can be deleted)
    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot delete leave request that has already been processed' 
      });
    }
    
    await leave.deleteOne();
    res.json({ message: 'Leave request removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 