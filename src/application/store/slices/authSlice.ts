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

const serializeUser = (user: UserProfile): UserProfile => {
  return {
    ...user,
    createdAt:
      typeof user.createdAt === "object"
        ? (user.createdAt as any).toISOString()
        : user.createdAt,
  };
};

const restoreUserFromToken = (): UserProfile | null => {
  try {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (token && savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Error restoring user:", error);
  }
  return null;
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
      localStorage.removeItem("authUser");
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      const serializedUser = serializeUser(action.payload);
      state.user = serializedUser;
      state.isAuthenticated = true;
      localStorage.setItem("authUser", JSON.stringify(serializedUser));
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    restoreAuth: (state) => {
      const user = restoreUserFromToken();
      const token = localStorage.getItem("authToken");
      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
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
        const serializedUser = serializeUser(action.payload.user);
        state.user = serializedUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
          localStorage.setItem("authUser", JSON.stringify(serializedUser));
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
        const serializedUser = serializeUser(action.payload.user);
        state.user = serializedUser;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.token) {
          localStorage.setItem("authToken", action.payload.token);
          localStorage.setItem("authUser", JSON.stringify(serializedUser));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUser, setToken, clearError, restoreAuth } =
  authSlice.actions;
export default authSlice.reducer;
