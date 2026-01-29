import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutDeliveryPage: React.FC = () => {
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
        <h2>Billing Details</h2>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <input type="text" className="form-control" id="address" required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <input type="text" className="form-control" id="city" required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="zip" className="form-label">
                ZIP Code *
              </label>
              <input type="text" className="form-control" id="zip" required />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input type="email" className="form-control" id="email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone *
            </label>
            <input type="tel" className="form-control" id="phone" required />
          </div>
          <Link to="/checkout/summary" className="btn btn-primary">
            Continue to Payment
          </Link>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutDeliveryPage;
