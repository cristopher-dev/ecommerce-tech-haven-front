import { ValidationErrors } from "@/shared/types/auth";
import { ChangeEvent, FocusEvent, useState } from "react";

interface UseFormValidationProps<T> {
  initialFormData: T;
  validateForm: (formData: T) => ValidationErrors;
}

export function useFormValidation<T>({
  initialFormData,
  validateForm,
}: UseFormValidationProps<T>) {
  const [formData, setFormData] = useState<T>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleValidate = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    touched,
    setTouched,
    handleChange,
    handleBlur,
    handleValidate,
    resetForm,
  } as const;
}
