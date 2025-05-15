import axios from 'axios';

const API_URL = '/api/employees';

// Get all employees
const getEmployees = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get employees by department
const getEmployeesByDepartment = async (departmentId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/department/${departmentId}`,
    config
  );
  return response.data;
};

// Get employee by ID
const getEmployeeById = async (employeeId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${employeeId}`, config);
  return response.data;
};

// Create new employee
const createEmployee = async (employeeData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, employeeData, config);
  return response.data;
};

// Update employee
const updateEmployee = async (employeeId: string, employeeData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${employeeId}`,
    employeeData,
    config
  );
  return response.data;
};

// Delete employee
const deleteEmployee = async (employeeId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${employeeId}`, config);
  return response.data;
};

const employeeService = {
  getEmployees,
  getEmployeesByDepartment,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeService; 