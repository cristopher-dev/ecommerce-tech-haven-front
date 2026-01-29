import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { clearCheckout } from "@/application/store/slices/checkoutSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutFinalStatusPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);

  useEffect(() => {
    // Redirect to home if no transaction ID (user came directly)
    if (!checkout.lastTransactionId) {
      navigate("/");
    }
  }, [checkout.lastTransactionId, navigate]);

  const handleReturnHome = () => {
    dispatch(clearCheckout());
    navigate("/");
  };

  // Calculate order total
  const subtotal = checkout.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const baseFee = checkout.baseFee / 100;
  const deliveryFee = checkout.deliveryFee / 100;
  const total = subtotal + baseFee + deliveryFee;

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Success Card */}
            <div className="card border-success shadow-lg">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div className="display-1 text-success">
                    <i className="bi bi-check-circle-fill">✓</i>
                  </div>
                </div>

                <h1 className="card-title text-success mb-2">
                  Order Confirmed!
                </h1>
                <p className="card-text text-muted mb-4">
                  Thank you for your purchase. Your order has been placed
                  successfully.
                </p>

                {/* Transaction Details */}
                <div className="bg-light p-4 rounded mb-4">
                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">Transaction ID</small>
                    </div>
                    <div className="col-6 text-end">
                      <strong className="text-monospace">
                        {checkout.lastTransactionId}
                      </strong>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">Order Date</small>
                    </div>
                    <div className="col-6 text-end">
                      <strong>{new Date().toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">Subtotal</small>
                    </div>
                    <div className="col-6 text-end">${subtotal.toFixed(2)}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">Fees</small>
                    </div>
                    <div className="col-6 text-end">
                      ${(baseFee + deliveryFee).toFixed(2)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 text-start">
                      <strong>Total Paid</strong>
                    </div>
                    <div className="col-6 text-end">
                      <strong className="text-success fs-5">
                        ${total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {checkout.cartItems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-start mb-3">Order Items</h5>
                    <div className="list-group list-group-flush">
                      {checkout.cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="list-group-item px-0"
                        >
                          <div className="row align-items-center">
                            <div className="col-8 text-start">
                              <p className="mb-1">{item.product.name}</p>
                              <small className="text-muted">
                                Qty: {item.quantity}
                              </small>
                            </div>
                            <div className="col-4 text-end">
                              <strong>
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2,
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                {checkout.deliveryData && (
                  <div className="mb-4">
                    <h5 className="text-start mb-3">Delivery Address</h5>
                    <div className="alert alert-info" role="alert">
                      <p className="mb-1">{checkout.deliveryData.address}</p>
                      <p className="mb-0">
                        {checkout.deliveryData.city},{" "}
                        {checkout.deliveryData.state}{" "}
                        {checkout.deliveryData.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 mt-5">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReturnHome}
                  >
                    Continue Shopping
                  </button>
                  <Link to="/" className="btn btn-outline-secondary">
                    Back to Home
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: "100%" }}
                      aria-valuenow={100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Step 3 of 3: Order Complete
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutFinalStatusPage;
