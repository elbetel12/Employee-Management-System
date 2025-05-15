import { Request, Response } from 'express';
import Department, { IDepartment } from '../models/Department';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({})
      .populate('department_head', 'first_name last_name');
    
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('department_head', 'first_name last_name');
    
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req: Request, res: Response) => {
  const { department_name, department_head, description } = req.body;

  try {
    const department = await Department.create({
      department_name,
      department_head: department_head || null,
      description,
    });

    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req: Request, res: Response) => {
  const { department_name, department_head, description, is_active } = req.body;

  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      department.department_name = department_name || department.department_name;
      department.department_head = department_head || department.department_head;
      department.description = description || department.description;
      department.is_active = is_active !== undefined ? is_active : department.is_active;

      const updatedDepartment = await department.save();
      res.json(updatedDepartment);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const department = await Department.findById(req.params.id);

    if (department) {
      await department.deleteOne();
      res.json({ message: 'Department removed' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 