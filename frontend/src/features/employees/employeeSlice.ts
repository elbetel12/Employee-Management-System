import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from './employeeService';

interface Employee {
  _id: string;
  user: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  department: any; // Could be string (ID) or populated object
  hire_date: string;
  salary: number;
  is_department_head: boolean;
  image?: string;
  is_active: boolean;
  qr_code_image?: string;
}

interface EmployeeState {
  employees: Employee[];
  employee: Employee | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: EmployeeState = {
  employees: [],
  employee: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all employees
export const getEmployees = createAsyncThunk(
  'employees/getAll',
  async (_, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.getEmployees(state.auth.user.token);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get employees by department
export const getEmployeesByDepartment = createAsyncThunk(
  'employees/getByDepartment',
  async (departmentId: string, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.getEmployeesByDepartment(
        departmentId,
        state.auth.user.token
      );
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get employee by ID
export const getEmployeeById = createAsyncThunk(
  'employees/getById',
  async (employeeId: string, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.getEmployeeById(
        employeeId,
        state.auth.user.token
      );
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData: any, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.createEmployee(
        employeeData,
        state.auth.user.token
      );
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async (
    { employeeId, employeeData }: { employeeId: string; employeeData: any },
    thunkAPI: any
  ) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.updateEmployee(
        employeeId,
        employeeData,
        state.auth.user.token
      );
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (employeeId: string, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await employeeService.deleteEmployee(
        employeeId,
        state.auth.user.token
      );
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    resetEmployee: (state) => {
      state.employee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getEmployeesByDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeesByDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = action.payload;
      })
      .addCase(getEmployeesByDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getEmployeeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employee = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = state.employees.map((employee) =>
          employee._id === action.payload._id ? action.payload : employee
        );
        state.employee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.employees = state.employees.filter(
          (employee) => employee._id !== action.payload.id
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, resetEmployee } = employeeSlice.actions;
export default employeeSlice.reducer; 