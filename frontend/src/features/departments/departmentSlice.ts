import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentService from './departmentService';

export interface DepartmentHead {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface Department {
  _id: string;
  department_name: string;
  department_head: DepartmentHead | string | null;
  description: string;
  is_active: boolean;
}

interface DepartmentState {
  departments: Department[];
  department: Department | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: DepartmentState = {
  departments: [],
  department: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all departments
export const getDepartments = createAsyncThunk(
  'departments/getAll',
  async (_, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await departmentService.getDepartments(state.auth.user.token);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get department by ID
export const getDepartmentById = createAsyncThunk(
  'departments/getById',
  async (departmentId: string, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await departmentService.getDepartmentById(
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

// Create new department
export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData: any, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await departmentService.createDepartment(
        departmentData,
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

// Update department
export const updateDepartment = createAsyncThunk(
  'departments/update',
  async (
    { departmentId, departmentData }: { departmentId: string; departmentData: any },
    thunkAPI: any
  ) => {
    try {
      const state = thunkAPI.getState();
      return await departmentService.updateDepartment(
        departmentId,
        departmentData,
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

// Delete department
export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (departmentId: string, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      return await departmentService.deleteDepartment(
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

export const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    resetDepartment: (state) => {
      state.department = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.departments = action.payload;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getDepartmentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.department = action.payload;
      })
      .addCase(getDepartmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.departments = state.departments.map((department) =>
          department._id === action.payload._id ? action.payload : department
        );
        state.department = action.payload;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.departments = state.departments.filter(
          (department) => department._id !== action.payload.id
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, resetDepartment } = departmentSlice.actions;
export default departmentSlice.reducer; 