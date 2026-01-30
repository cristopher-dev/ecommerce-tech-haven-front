import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import {
  setDeliveryData,
  setPaymentData,
  setStep,
} from "@/application/store/slices/checkoutSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PaymentModal, { type PaymentFormData } from "../components/PaymentModal";

const CheckoutDeliveryPage: React.FC = () => {
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
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State/Province is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

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
    // Save payment data to Redux (without CVV for security)
    dispatch(
      setPaymentData({
        cardNumber: paymentData.cardNumber
          .slice(-4)
          .padStart(paymentData.cardNumber.length, "*"),
        cardholderName: paymentData.cardholderName,
        expirationMonth: paymentData.expirationMonth,
        expirationYear: paymentData.expirationYear,
        cvv: "", // Never store CVV
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
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart">Cart</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Checkout - Delivery
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
              Step 1 of 3: Delivery
            </div>
          </div>
        </div>
        <h2>Delivery Information</h2>
        <form onSubmit={handleDeliverySubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name *
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
                Last Name *
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
              Address *
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
                City *
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
                State/Province *
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
                ZIP Code *
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
              Email *
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
              Phone *
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
              Back to Cart
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
                  Processing...
                </>
              ) : (
                "Continue to Payment"
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
