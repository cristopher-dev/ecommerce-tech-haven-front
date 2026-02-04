import { renderHook, act } from "@testing-library/react";
import { useFormValidation } from "@/presentation/hooks/useFormValidation";
import { ChangeEvent, FocusEvent } from "react";

describe("useFormValidation hook", () => {
  interface TestFormData {
    email: string;
    password: string;
  }

  const initialFormData: TestFormData = {
    email: "",
    password: "",
  };

  const validateForm = (data: TestFormData) => {
    const errors: Record<string, string> = {};
    
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!data.email.includes("@")) {
      errors.email = "Invalid email";
    }
    
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    return errors;
  };

  it("should initialize with initial form data", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    expect(result.current.formData).toEqual(initialFormData);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it("should handle form input changes", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    act(() => {
      const event = {
        target: { name: "email", value: "test@example.com" },
      } as unknown as ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.formData.email).toBe("test@example.com");
  });

  it("should track touched fields on blur", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    act(() => {
      const event = {
        target: { name: "email" },
      } as unknown as FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    expect(result.current.touched.email).toBe(true);
  });

  it("should clear errors for touched fields when changed", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    // First mark field as touched
    act(() => {
      const event = {
        target: { name: "email" },
      } as unknown as FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    // Validate to set error
    act(() => {
      result.current.handleValidate();
    });

    expect(result.current.errors.email).toBeDefined();

    // Change value to clear error
    act(() => {
      const event = {
        target: { name: "email", value: "test@example.com" },
      } as unknown as ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    expect(result.current.errors.email).toBe("");
  });

  it("should validate form and return validation status", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    let isValid = false;
    act(() => {
      isValid = result.current.handleValidate();
    });

    expect(isValid).toBe(false);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it("should reset form to initial state", () => {
    const { result } = renderHook(() =>
      useFormValidation({ initialFormData, validateForm })
    );

    // Change form data
    act(() => {
      const event = {
        target: { name: "email", value: "test@example.com" },
      } as unknown as ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });

    // Mark field as touched and validate
    act(() => {
      const event = {
        target: { name: "password" },
      } as unknown as FocusEvent<HTMLInputElement>;
      result.current.handleBlur(event);
    });

    act(() => {
      result.current.handleValidate();
    });

    // Reset
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialFormData);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});
