import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../../presentation/pages/RegisterPage';
import authReducer from '../../../application/store/slices/authSlice';

// Mock the useTechHavenApi hook
jest.mock('../../../infrastructure/hooks/useTechHavenApi', () => ({
  useTechHavenApi: () => ({
    register: jest.fn().mockResolvedValue({}),
  }),
}));

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      }
    },
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('RegisterPage', () => {
  it('should render register page', () => {
    renderWithProviders(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields on submit', async () => {
    renderWithProviders(<RegisterPage />);
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errors = screen.getAllByText('This field is required');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('should show error for invalid email', async () => {
    renderWithProviders(<RegisterPage />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email', name: 'email' } });
    fireEvent.blur(emailInput);
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('should show error for short password', async () => {
    renderWithProviders(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: '123', name: 'password' } });
    fireEvent.blur(passwordInput);
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should show error for password mismatch', async () => {
    renderWithProviders(<RegisterPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different', name: 'confirmPassword' } });
    fireEvent.blur(confirmPasswordInput);
    
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show server error if registration fails', () => {
    const errorState = {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: 'Registration failed server side',
        isAuthenticated: false,
      }
    };
    renderWithProviders(<RegisterPage />, { preloadedState: errorState as any });
    expect(screen.getByText('Registration failed server side')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John', name: 'firstName' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe', name: 'lastName' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123', name: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123', name: 'confirmPassword' } });

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });
});
