import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin
export const getAttendances = async (req: Request, res: Response) => {
  try {
    const attendances = await Attendance.find({})
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .sort({ date: -1 });
    
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get attendance records by employee
// @route   GET /api/attendance/employee/:id
// @access  Private
export const getAttendanceByEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const attendances = await Attendance.find({ employee: id })
      .sort({ date: -1 });
    
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get attendance records by date range
// @route   GET /api/attendance/daterange
// @access  Private/Admin
export const getAttendanceByDateRange = async (req: Request, res: Response) => {
  const { startDate, endDate, employeeId } = req.query;
  
  try {
    const query: any = {
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      }
    };
    
    if (employeeId) {
      query.employee = employeeId;
    }
    
    const attendances = await Attendance.find(query)
      .populate({
        path: 'employee',
        select: 'first_name last_name department',
        populate: {
          path: 'department',
          select: 'department_name'
        }
      })
      .sort({ date: 1 });
    
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Record check-in
// @route   POST /api/attendance/check-in
// @access  Private
export const checkIn = async (req: Request, res: Response) => {
  const { employeeId } = req.body;
  
  try {
    // Create date for today with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's already an attendance record for today
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (attendance) {
      if (attendance.check_in) {
        return res.status(400).json({ message: 'Already checked in today' });
      }
      
      attendance.check_in = new Date();
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        employee: employeeId,
        date: today,
        check_in: new Date()
      });
    }
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Record check-out
// @route   POST /api/attendance/check-out
// @access  Private
export const checkOut = async (req: Request, res: Response) => {
  const { employeeId } = req.body;
  
  try {
    // Create date for today with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!attendance) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }
    
    if (!attendance.check_in) {
      return res.status(400).json({ message: 'Must check-in before checking out' });
    }
    
    if (attendance.check_out) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    
    attendance.check_out = new Date();
    const updatedAttendance = await attendance.save();
    
    res.json(updatedAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Manually record attendance
// @route   POST /api/attendance
// @access  Private/Admin
export const createAttendance = async (req: Request, res: Response) => {
  const { employeeId, date, checkIn, checkOut } = req.body;
  
  try {
    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Create date object with time set to 00:00:00
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    // Check if there's already an attendance record for this date
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (attendance) {
      attendance.check_in = checkIn ? new Date(checkIn) : attendance.check_in;
      attendance.check_out = checkOut ? new Date(checkOut) : attendance.check_out;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        employee: employeeId,
        date: attendanceDate,
        check_in: checkIn ? new Date(checkIn) : null,
        check_out: checkOut ? new Date(checkOut) : null
      });
    }
    
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
export const updateAttendance = async (req: Request, res: Response) => {
  const { check_in, check_out } = req.body;
  
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (attendance) {
      attendance.check_in = check_in ? new Date(check_in) : attendance.check_in;
      attendance.check_out = check_out ? new Date(check_out) : attendance.check_out;
      
      const updatedAttendance = await attendance.save();
      res.json(updatedAttendance);
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (attendance) {
      await attendance.deleteOne();
      res.json({ message: 'Attendance record removed' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 