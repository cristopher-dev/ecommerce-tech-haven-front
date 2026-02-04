import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../../presentation/pages/RegisterPage';
import authReducer from '../../../application/store/slices/authSlice';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

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
      },
    },
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  i18n.changeLanguage('en');
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('RegisterPage', () => {
  it('should render register page', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields on submit', async () => {
    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await user.click(submitButton);

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });

  it('should show error for invalid email', async () => {
    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/^Email$/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
  });

  it('should show error for short password', async () => {
    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    await user.type(passwordInput, '123');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it('should show error for password mismatch', async () => {
    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different');
    await user.tab();

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/do not match/i)).toBeInTheDocument();
  });

  it('should show server error if registration fails', () => {
    const errorState = {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: 'Registration failed server side',
        isAuthenticated: false,
      },
    };
    renderWithProviders(<RegisterPage />, { preloadedState: errorState as any });
    expect(screen.getByText('Registration failed server side')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John', name: 'firstName' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe', name: 'lastName' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com', name: 'email' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123', name: 'password' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123', name: 'confirmPassword' },
    });

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });
});
