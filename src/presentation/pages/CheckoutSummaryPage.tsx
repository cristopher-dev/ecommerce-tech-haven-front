import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import {
  setStep,
  setLoading,
  setError,
  setLastTransactionId,
  clearCheckout,
} from "@/application/store/slices/checkoutSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutSummaryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = checkout.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const baseFee = checkout.baseFee / 100; // Convert cents to dollars
  const deliveryFee = checkout.deliveryFee / 100; // Convert cents to dollars
  const total = subtotal + baseFee + deliveryFee;

  const handlePlaceOrder = async () => {
    if (
      !checkout.paymentData ||
      !checkout.deliveryData ||
      checkout.cartItems.length === 0
    ) {
      dispatch(setError("Missing payment or delivery information"));
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));

      // TODO: Call backend API to process payment
      // const response = await fetch('/api/checkout/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: checkout.cartItems,
      //     deliveryData: checkout.deliveryData,
      //     paymentData: checkout.paymentData,
      //     total
      //   })
      // });

      // For now, simulate successful transaction
      const transactionId = `TXN-${Date.now()}`;
      dispatch(setLastTransactionId(transactionId));
      dispatch(setStep("status"));

      setTimeout(() => {
        setIsProcessing(false);
        dispatch(setLoading(false));
        navigate("/checkout/final");
      }, 1500);
    } catch (err) {
      dispatch(
        setError(
          err instanceof Error ? err.message : "Payment processing failed",
        ),
      );
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  if (checkout.cartItems.length === 0) {
    return (
      <div>
        <Header />
        <main className="container my-4">
          <div className="alert alert-warning">
            Your cart is empty. <Link to="/">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <li className="breadcrumb-item">
              <Link to="/checkout/delivery">Delivery</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Summary
            </li>
          </ol>
        </nav>
        <div className="mb-4">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "66%" }}
              aria-valuenow={66}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              Step 2 of 3: Summary
            </div>
          </div>
        </div>

        {checkout.error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {checkout.error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(setError(null))}
            />
          </div>
        )}

        <h2>Order Summary</h2>
        <div className="row">
          <div className="col-md-8">
            <h3>Your Order</h3>
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {checkout.cartItems.map((item) => (
                  <tr key={item.product.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="mt-4">Delivery Information</h3>
            {checkout.deliveryData && (
              <div className="card">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Address:</strong> {checkout.deliveryData.address}
                  </p>
                  <p className="mb-1">
                    <strong>City:</strong> {checkout.deliveryData.city},{" "}
                    {checkout.deliveryData.state}
                  </p>
                  <p className="mb-1">
                    <strong>ZIP:</strong> {checkout.deliveryData.postalCode}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {checkout.deliveryData.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <h3>Cost Breakdown</h3>
            <div className="card">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col">Subtotal:</div>
                  <div className="col text-end">${subtotal.toFixed(2)}</div>
                </div>
                <div className="row mb-2">
                  <div className="col">Base Fee:</div>
                  <div className="col text-end">${baseFee.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col">Delivery Fee:</div>
                  <div className="col text-end">${deliveryFee.toFixed(2)}</div>
                </div>
                <hr />
                <div className="row mb-3">
                  <div className="col fs-5 fw-bold">Total:</div>
                  <div className="col text-end fs-5 fw-bold text-primary">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <h5 className="mt-4 mb-3">Payment Information</h5>
                {checkout.paymentData && (
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Card:</strong> {checkout.paymentData.cardNumber}
                    </p>
                    <p className="mb-1">
                      <strong>Holder:</strong>{" "}
                      {checkout.paymentData.cardholderName}
                    </p>
                    <p className="mb-0">
                      <strong>Expires:</strong>{" "}
                      {checkout.paymentData.expirationMonth
                        .toString()
                        .padStart(2, "0")}
                      /
                      {checkout.paymentData.expirationYear.toString().slice(-2)}
                    </p>
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || checkout.loading}
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Processing Payment...
                      </>
                    ) : (
                      `Place Order (${total.toFixed(2)})`
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <Link
                    to="/checkout/delivery"
                    className="btn btn-outline-secondary w-100"
                  >
                    Back to Delivery
                  </Link>
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

export default CheckoutSummaryPage;
