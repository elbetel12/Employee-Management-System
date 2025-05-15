import axios from 'axios';

const API_URL = '/api/users';

// Register user
const register = async (userData: { 
  username: string; 
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData: { username: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Change password
const changePassword = async (
  passwordData: { currentPassword: string; newPassword: string },
  token?: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/password`,
    passwordData,
    config
  );

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  changePassword,
};

export default authService; 