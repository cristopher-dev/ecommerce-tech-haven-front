import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/application/store/slices/authSlice";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import { AuthState } from "@/shared/types/auth";

const createTestStore = (
  preloadedState: Record<string, AuthState> = {
    auth: {
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    },
  },
) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: preloadedState as any,
  });
};

describe("ProtectedRoute", () => {
  it("should render protected content when user is authenticated", () => {
    const store = createTestStore({
      auth: {
        user: null,
        token: "test-token",
        isLoading: false,
        error: null,
        isAuthenticated: true,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", () => {
    const store = createTestStore({
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
