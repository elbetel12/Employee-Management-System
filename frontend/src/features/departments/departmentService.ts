import axios from 'axios';

const API_URL = '/api/departments';

// Get all departments
const getDepartments = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get department by ID
const getDepartmentById = async (departmentId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/${departmentId}`, config);
  return response.data;
};

// Create new department
const createDepartment = async (departmentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, departmentData, config);
  return response.data;
};

// Update department
const updateDepartment = async (departmentId: string, departmentData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${departmentId}`, departmentData, config);
  return response.data;
};

// Delete department
const deleteDepartment = async (departmentId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${departmentId}`, config);
  return response.data;
};

const departmentService = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService; 