import { configureStore } from '@reduxjs/toolkit';
import authSlice, {
  logout,
  setUser,
  setToken,
  restoreAuth,
  login,
  register,
} from '@/application/store/slices/authSlice';
import { AuthState } from '@/shared/types/auth';
import { UserProfile } from '@/domain/entities/User';

// Mock the API repositories
jest.mock('@/infrastructure/adapters/TechHavenApiRepositories');

describe('authSlice', () => {
  let store: any;
  const mockUser: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-01-01').toISOString(),
    role: 'user',
    isActive: true,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    store = configureStore({
      reducer: { auth: authSlice },
    });
  });

  describe('reducers', () => {
    it('should handle logout', () => {
      // First set auth state
      store.dispatch(setUser(mockUser));
      store.dispatch(setToken('test-token'));

      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();

      // Then logout
      store.dispatch(logout());
      state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('authUser')).toBeNull();
    });

    it('should handle setUser', () => {
      store.dispatch(setUser(mockUser));
      const state = store.getState().auth;

      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe('john@example.com');
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem('authUser')).toBeTruthy();
    });

    it('should handle setToken', () => {
      const testToken = 'test-token-123';
      store.dispatch(setToken(testToken));
      const state = store.getState().auth;

      expect(state.token).toBe(testToken);
      expect(localStorage.getItem('authToken')).toBe(testToken);
    });

    it('should handle restoreAuth when user and token exist', () => {
      // Setup localStorage
      localStorage.setItem('authToken', 'saved-token');
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      store.dispatch(restoreAuth());
      const state = store.getState().auth;

      expect(state.user).toBeDefined();
      expect(state.token).toBe('saved-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle restoreAuth when no stored data exists', () => {
      store.dispatch(restoreAuth());
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle restoreAuth with invalid stored user data', () => {
      localStorage.setItem('authToken', 'saved-token');
      localStorage.setItem('authUser', 'invalid-json');

      store.dispatch(restoreAuth());
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle restoreAuth with user but no token', () => {
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      store.dispatch(restoreAuth());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle restoreAuth with token but no user', () => {
      localStorage.setItem('authToken', 'saved-token');
      store.dispatch(restoreAuth());
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('register async thunk', () => {
    it('should handle register.pending', () => {
      const action = register.pending('', {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
      });
      const state = authSlice(undefined, action as any);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle register.rejected', () => {
      const action = register.rejected(
        new Error('Registration error'),
        '',
        { firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password' },
        'Registration error'
      );
      const state = authSlice(
        { user: null, token: null, isLoading: true, error: null, isAuthenticated: false },
        { type: register.rejected.type, payload: 'Registration error' }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Registration error');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('login async thunk', () => {
    it('should handle login.pending', () => {
      const action = login.pending('', { email: 'test@example.com', password: 'password' });
      const state = authSlice(undefined, action as any);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login.rejected', () => {
      const action = { type: login.rejected.type, payload: 'Login failed' };
      const state = authSlice(
        { user: null, token: null, isLoading: true, error: null, isAuthenticated: false },
        action as any
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Login failed');
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle login.fulfilled without token', () => {
      const action = {
        type: login.fulfilled.type,
        payload: { user: mockUser, token: null },
      };
      const initialState = {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      };
      const state = authSlice(initialState, action);
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
