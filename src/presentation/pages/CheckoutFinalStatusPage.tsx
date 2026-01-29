import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutFinalStatusPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container my-4 text-center">
        <nav aria-label="breadcrumb" className="justify-content-center mb-4">
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
            <li className="breadcrumb-item">
              <Link to="/checkout/summary">Summary</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Final Status
            </li>
          </ol>
        </nav>
        <div className="mb-4">
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: "100%" }}
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              Step 3 of 3: Completed
            </div>
          </div>
        </div>
        <h2>Order Confirmed!</h2>
        <p>
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p>Order Number: #12345</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutFinalStatusPage;
