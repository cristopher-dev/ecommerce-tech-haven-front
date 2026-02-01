import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import {
  setDeliveryData,
  setPaymentData,
  setStep,
} from "@/application/store/slices/checkoutSlice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PaymentModal, { type PaymentFormData } from "../components/PaymentModal";

const CheckoutDeliveryPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    email: "",
    phone: "",
    state: "",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = t("checkoutDelivery.validation.firstNameRequired");
    if (!formData.lastName.trim())
      newErrors.lastName = t("checkoutDelivery.validation.lastNameRequired");
    if (!formData.address.trim())
      newErrors.address = t("checkoutDelivery.validation.addressRequired");
    if (!formData.city.trim())
      newErrors.city = t("checkoutDelivery.validation.cityRequired");
    if (!formData.state.trim())
      newErrors.state = t("checkoutDelivery.validation.stateRequired");
    if (!formData.zipCode.trim())
      newErrors.zipCode = t("checkoutDelivery.validation.zipCodeRequired");
    if (!formData.email.trim())
      newErrors.email = t("checkoutDelivery.validation.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("checkoutDelivery.validation.emailInvalid");
    if (!formData.phone.trim())
      newErrors.phone = t("checkoutDelivery.validation.phoneRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
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

    if (validateForm()) {
      // Save delivery data to Redux
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

      // Show payment modal
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSubmit = (paymentData: PaymentFormData) => {
    // Save payment data to Redux (including CVV temporarily for transaction processing)
    // Note: CVV will be cleared after payment processing for security
    dispatch(
      setPaymentData({
        cardNumber: paymentData.cardNumber,
        cardholderName: paymentData.cardholderName,
        expirationMonth: paymentData.expirationMonth,
        expirationYear: paymentData.expirationYear,
        cvv: paymentData.cvv,
      }),
    );

    setShowPaymentModal(false);

    // Move to summary page
    dispatch(setStep("summary"));
    navigate("/checkout/summary");
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
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "33%" }}
              aria-valuenow={33}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {t("checkoutDelivery.progressBar")}
            </div>
          </div>
        </div>
        <h2>{t("checkoutDelivery.title")}</h2>
        <form onSubmit={handleDeliverySubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">
                {t("checkoutDelivery.firstName")} *
              </label>
              <input
                type="text"
                className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""}`}
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, firstName: true })}
                disabled={checkout.loading}
              />
              {touched.firstName && errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label">
                {t("checkoutDelivery.lastName")} *
              </label>
              <input
                type="text"
                className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""}`}
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, lastName: true })}
                disabled={checkout.loading}
              />
              {touched.lastName && errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              {t("checkoutDelivery.address")} *
            </label>
            <input
              type="text"
              className={`form-control ${touched.address && errors.address ? "is-invalid" : ""}`}
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, address: true })}
              disabled={checkout.loading}
            />
            {touched.address && errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="city" className="form-label">
                {t("checkoutDelivery.city")} *
              </label>
              <input
                type="text"
                className={`form-control ${touched.city && errors.city ? "is-invalid" : ""}`}
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, city: true })}
                disabled={checkout.loading}
              />
              {touched.city && errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="state" className="form-label">
                {t("checkoutDelivery.state")} *
              </label>
              <input
                type="text"
                className={`form-control ${touched.state && errors.state ? "is-invalid" : ""}`}
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, state: true })}
                disabled={checkout.loading}
              />
              {touched.state && errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="zipCode" className="form-label">
                {t("checkoutDelivery.zipCode")} *
              </label>
              <input
                type="text"
                className={`form-control ${touched.zipCode && errors.zipCode ? "is-invalid" : ""}`}
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, zipCode: true })}
                disabled={checkout.loading}
              />
              {touched.zipCode && errors.zipCode && (
                <div className="invalid-feedback">{errors.zipCode}</div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("checkoutDelivery.email")} *
            </label>
            <input
              type="email"
              className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, email: true })}
              disabled={checkout.loading}
            />
            {touched.email && errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              {t("checkoutDelivery.phone")} *
            </label>
            <input
              type="tel"
              className={`form-control ${touched.phone && errors.phone ? "is-invalid" : ""}`}
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, phone: true })}
              disabled={checkout.loading}
            />
            {touched.phone && errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>
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
                    role="status"
                  />
                  {t("checkoutDelivery.processing")}
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
          loading={checkout.loading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutDeliveryPage;
