import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/domain/entities/User";
import {
  RegisterUseCase,
  IAuthRepository,
} from "@/application/useCases/RegisterUseCase";
import { LoginUseCase } from "@/application/useCases/LoginUseCase";
import { TechHavenApiAuthRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import { RegisterRequest, AuthState } from "@/shared/types/auth";

const authRepository = new TechHavenApiAuthRepository();
const registerUseCase = new RegisterUseCase(authRepository);
const loginUseCase = new LoginUseCase(authRepository);

export const register = createAsyncThunk(
  "auth/register",
  async (request: RegisterRequest, { rejectWithValue }) => {
    try {
      const user = await registerUseCase.execute(request);
      const token = localStorage.getItem("authToken");
      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { user, token } = await loginUseCase.execute(email, password);
      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  },
);

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
