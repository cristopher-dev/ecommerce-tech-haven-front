import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import {
  setDeliveryData,
  setPaymentData,
  setStep,
} from "@/application/store/slices/checkoutSlice";
import { transactionsApi } from "@/infrastructure/api/techHavenApiClient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PaymentModal, { type PaymentFormData } from "../components/PaymentModal";

interface FormDataType {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  phone: string;
  state: string;
}

const INITIAL_FORM_DATA: FormDataType = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  zipCode: "",
  email: "",
  phone: "",
  state: "",
};

const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

const getFieldError = (
  name: keyof FormDataType,
  value: string,
  t: (key: string) => string,
): string => {
  const isEmpty = !value.trim();
  const messages: Record<keyof FormDataType, string> = {
    firstName: t("checkoutDelivery.validation.firstNameRequired"),
    lastName: t("checkoutDelivery.validation.lastNameRequired"),
    address: t("checkoutDelivery.validation.addressRequired"),
    city: t("checkoutDelivery.validation.cityRequired"),
    state: t("checkoutDelivery.validation.stateRequired"),
    zipCode: t("checkoutDelivery.validation.zipCodeRequired"),
    email: t("checkoutDelivery.validation.emailRequired"),
    phone: t("checkoutDelivery.validation.phoneRequired"),
  };

  if (isEmpty) return messages[name];
  if (name === "email" && !isValidEmail(value)) {
    return t("checkoutDelivery.validation.emailInvalid");
  }
  return "";
};

interface RowFormFieldProps {
  name: keyof FormDataType;
  label: string;
  colClass?: string;
  type?: string;
}

const RowFormField: React.FC<
  RowFormFieldProps & {
    value: string;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    autocomplete?: string;
  }
> = ({
  name,
  label,
  colClass = "col-md-6",
  type = "text",
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
  autocomplete,
}) => (
  <div className={`${colClass} mb-3`}>
    <label htmlFor={name} className="form-label">
      {label} *
    </label>
    <input
      type={type}
      className={`form-control ${touched && error ? "is-invalid" : ""}`}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      autoComplete={autocomplete}
    />
    {touched && error && <div className="invalid-feedback">{error}</div>}
  </div>
);

const FullWidthFormField: React.FC<{
  name: keyof FormDataType;
  label: string;
  type?: string;
  value: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  autocomplete?: string;
}> = ({
  name,
  label,
  type = "text",
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
  autocomplete,
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">
      {label} *
    </label>
    <input
      type={type}
      className={`form-control ${touched && error ? "is-invalid" : ""}`}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      autoComplete={autocomplete}
    />
    {touched && error && <div className="invalid-feedback">{error}</div>}
  </div>
);

const CheckoutDeliveryPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);

  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const markAllFieldsTouched = (): void => {
    setTouched({
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      zipCode: true,
      email: true,
      phone: true,
      state: true,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const key of Object.keys(INITIAL_FORM_DATA) as Array<
      keyof FormDataType
    >) {
      const error = getFieldError(key, formData[key], t);
      if (error) newErrors[key] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDeliveryDataAndShowPayment = (): void => {
    dispatch(
      setDeliveryData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        email: formData.email,
        phone: formData.phone,
      }),
    );
    setShowPaymentModal(true);
  };

  const handleDeliverySubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    markAllFieldsTouched();

    if (validateForm()) {
      saveDeliveryDataAndShowPayment();
    }
  };

  const savPaymentDataAndProceed = (): void => {
    setShowPaymentModal(false);
    dispatch(setStep("summary"));
    navigate("/checkout/summary");
  };

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    setPaymentLoading(true);
    try {
      await transactionsApi.tokenizeCard({
        cardNumber: paymentData.cardNumber,
        expirationMonth: paymentData.expirationMonth,
        expirationYear: paymentData.expirationYear % 100,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
      });
      dispatch(
        setPaymentData({
          cardNumber: paymentData.cardNumber,
          cardholderName: paymentData.cardholderName,
          expirationMonth: paymentData.expirationMonth,
          expirationYear: paymentData.expirationYear,
          cvv: paymentData.cvv,
        }),
      );
      savPaymentDataAndProceed();
    } catch (error) {
      console.error("Error tokenizing card:", error);
      // Handle error - maybe show a toast or alert
    } finally {
      setPaymentLoading(false);
    }
  };
  return (
    <div>
      <Header />
      <main className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t("header.home")}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart">{t("header.cart")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("checkoutDelivery.breadcrumb")}
            </li>
          </ol>
        </nav>
        <div className="mb-4">
          <progress value={33} max={100} className="w-100" />
        </div>
        <h2>{t("checkoutDelivery.title")}</h2>
        <form onSubmit={handleDeliverySubmit}>
          <div className="row">
            <RowFormField
              name="firstName"
              label={t("checkoutDelivery.firstName")}
              value={formData.firstName}
              error={errors.firstName}
              touched={touched.firstName}
              disabled={checkout.loading}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, firstName: true })}
              autocomplete="given-name"
            />
            <RowFormField
              name="lastName"
              label={t("checkoutDelivery.lastName")}
              value={formData.lastName}
              error={errors.lastName}
              touched={touched.lastName}
              disabled={checkout.loading}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, lastName: true })}
              autocomplete="family-name"
            />
          </div>
          <FullWidthFormField
            name="address"
            label={t("checkoutDelivery.address")}
            value={formData.address}
            error={errors.address}
            touched={touched.address}
            disabled={checkout.loading}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, address: true })}
            autocomplete="street-address"
          />
          <div className="row">
            <RowFormField
              name="city"
              label={t("checkoutDelivery.city")}
              value={formData.city}
              error={errors.city}
              touched={touched.city}
              disabled={checkout.loading}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, city: true })}
              autocomplete="address-level2"
            />
            <RowFormField
              name="state"
              label={t("checkoutDelivery.state")}
              value={formData.state}
              error={errors.state}
              touched={touched.state}
              disabled={checkout.loading}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, state: true })}
              autocomplete="address-level1"
            />
          </div>
          <div className="row">
            <RowFormField
              name="zipCode"
              label={t("checkoutDelivery.zipCode")}
              colClass="col-md-6"
              value={formData.zipCode}
              error={errors.zipCode}
              touched={touched.zipCode}
              disabled={checkout.loading}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, zipCode: true })}
              autocomplete="postal-code"
            />
          </div>
          <FullWidthFormField
            name="email"
            label={t("checkoutDelivery.email")}
            type="email"
            value={formData.email}
            error={errors.email}
            touched={touched.email}
            disabled={checkout.loading}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, email: true })}
            autocomplete="email"
          />
          <FullWidthFormField
            name="phone"
            label={t("checkoutDelivery.phone")}
            type="tel"
            value={formData.phone}
            error={errors.phone}
            touched={touched.phone}
            disabled={checkout.loading}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, phone: true })}
            autocomplete="tel"
          />
          <div className="d-flex gap-2 justify-content-between mt-4">
            <Link to="/cart" className="btn btn-secondary">
              {t("checkoutDelivery.backToCart")}
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={checkout.loading}
            >
              {checkout.loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-label={t("checkoutDelivery.processing")}
                  />
                  <output>{t("checkoutDelivery.processing")}</output>
                </>
              ) : (
                t("checkoutDelivery.continueToPayment")
              )}
            </button>
          </div>
        </form>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
          loading={paymentLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutDeliveryPage;
