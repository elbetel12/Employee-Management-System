import { Request, Response } from 'express';
import Performance from '../models/Performance';
import Employee from '../models/Employee';
import Notification from '../models/Notification';
import mongoose from 'mongoose';

// @desc    Get all performance evaluations
// @route   GET /api/performances
// @access  Private/Admin
export const getPerformances = async (req: Request, res: Response) => {
  try {
    const performances = await Performance.find({})
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .populate('evaluated_by', 'username first_name last_name')
      .sort({ date: -1 });
    
    res.json(performances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get performance evaluations by employee
// @route   GET /api/performances/employee/:id
// @access  Private
export const getPerformancesByEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const performances = await Performance.find({ employee: id })
      .populate('evaluated_by', 'username first_name last_name')
      .sort({ date: -1 });
    
    res.json(performances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get performance evaluation by ID
// @route   GET /api/performances/:id
// @access  Private
export const getPerformanceById = async (req: Request, res: Response) => {
  try {
    const performance = await Performance.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'first_name last_name department user',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .populate('evaluated_by', 'username first_name last_name');
    
    if (performance) {
      res.json(performance);
    } else {
      res.status(404).json({ message: 'Performance evaluation not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a performance evaluation
// @route   POST /api/performances
// @access  Private/Manager
export const createPerformance = async (req: Request, res: Response) => {
  const { employeeId, rating, comments } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify the employee exists
    const employee = await Employee.findById(employeeId)
      .populate('user');
    
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Create the performance evaluation
    const performance = await Performance.create([{
      employee: employeeId,
      date: new Date(),
      rating,
      comments,
      evaluated_by: req.user._id
    }], { session });

    // Create notification for the employee
    if (employee.user) {
      await Notification.create([{
        user: employee.user,
        message: `You have received a new performance evaluation`,
        timestamp: new Date()
      }], { session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(performance[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a performance evaluation
// @route   PUT /api/performances/:id
// @access  Private/Manager
export const updatePerformance = async (req: Request, res: Response) => {
  const { rating, comments } = req.body;
  
  try {
    const performance = await Performance.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }
    
    // Only allow the original evaluator or an admin to update it
    if (
      performance.evaluated_by?.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ 
        message: 'Not authorized to update this performance evaluation' 
      });
    }
    
    performance.rating = rating || performance.rating;
    performance.comments = comments || performance.comments;
    
    const updatedPerformance = await performance.save();
    res.json(updatedPerformance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a performance evaluation
// @route   DELETE /api/performances/:id
// @access  Private/Admin
export const deletePerformance = async (req: Request, res: Response) => {
  try {
    const performance = await Performance.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }
    
    await performance.deleteOne();
    res.json({ message: 'Performance evaluation removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 