import { register } from "@/application/store/slices/authSlice";
import { AppDispatch, RootState } from "@/application/store/store";
import { useFormValidation } from "@/presentation/hooks/useFormValidation";
import { ValidationErrors } from "@/shared/types/auth";
import "@/styles/pages/auth.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validateRegisterForm = (data: FormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = t("errors.required");
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = t("errors.required");
    }

    if (!data.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t("errors.invalidEmail");
    }

    if (!data.password) {
      newErrors.password = t("errors.required");
    } else if (data.password.length < 6) {
      newErrors.password = t("errors.passwordTooShort");
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = t("errors.required");
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }

    return newErrors;
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleValidate,
  } = useFormValidation<FormData>({
    initialFormData: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateForm: validateRegisterForm,
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!handleValidate()) {
      return;
    }

    const result = await dispatch(
      register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/product");
    }
  };

  return (
    <div className="register-page-fullscreen">
      <main className="register-container">
        <div className="register-card">
          <h1>{t("authPage.register.title")}</h1>
          <p>{t("homePage.hero")}</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">{t("common.firstName")}</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.firstName && touched.firstName ? "is-invalid" : ""
                  }
                  placeholder="John"
                />
                {errors.firstName && touched.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">{t("common.lastName")}</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.lastName && touched.lastName ? "is-invalid" : ""
                  }
                  placeholder="Doe"
                />
                {errors.lastName && touched.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t("common.email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email && touched.email ? "is-invalid" : ""}
                placeholder="john@example.com"
              />
              {errors.email && touched.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("common.password")}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password ? "is-invalid" : ""
                }
                placeholder="••••••••"
              />
              {errors.password && touched.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                {t("common.confirmPassword")}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "is-invalid"
                    : ""
                }
                placeholder="••••••••"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-register"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("authPage.register.submit")}
            </button>
          </form>

          <p className="login-link">
            {t("authPage.register.alreadyAccount")}{" "}
            <a href="/login">{t("authPage.register.signin")}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
