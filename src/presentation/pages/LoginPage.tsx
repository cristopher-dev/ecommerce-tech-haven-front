import { login } from "@/application/store/slices/authSlice";
import { AppDispatch, RootState } from "@/application/store/store";
import { useFormValidation } from "@/presentation/hooks/useFormValidation";
import { ValidationErrors } from "@/shared/types/auth";
import "@/styles/pages/auth.scss";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validateLoginForm = (data: FormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t("errors.invalidEmail");
    }

    if (!data.password) {
      newErrors.password = t("errors.required");
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
      email: "admin@techhaven.com",
      password: "admin123",
    },
    validateForm: validateLoginForm,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidate()) {
      return;
    }

    const result = await dispatch(
      login({
        email: formData.email,
        password: formData.password,
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="login-page-fullscreen">
      <main className="login-container">
        <div className="login-card">
          <h1>{t("common.welcome")}</h1>
          <p>{t("authPage.login.title")}</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("common.login")}
            </button>
          </form>

          <div className="additional-links">
            <a href="#forgot-password" className="forgot-password">
              {t("authPage.login.forgotPassword")}
            </a>
          </div>

          <p className="register-link">
            {t("authPage.login.noAccount")}{" "}
            <a href="/register">{t("authPage.login.signup")}</a>
          </p>
        </div>
      </main>
    </div>
  );
}
