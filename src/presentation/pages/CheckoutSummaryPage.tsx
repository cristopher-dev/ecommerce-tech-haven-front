import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutSummaryPage: React.FC = () => {
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
        <h2>Order Summary</h2>
        <div className="row">
          <div className="col-md-8">
            <h3>Your Order</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product 1</td>
                  <td>1</td>
                  <td>$99.00</td>
                </tr>
              </tbody>
            </table>
            <p>Subtotal: $99.00</p>
            <p>Shipping: $10.00</p>
            <p>Total: $109.00</p>
          </div>
          <div className="col-md-4">
            <h3>Payment</h3>
            <form>
              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">
                  Card Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="expiry" className="form-label">
                    Expiry
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="expiry"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cvv"
                    required
                  />
                </div>
              </div>
              <Link to="/checkout/final" className="btn btn-primary">
                Place Order
              </Link>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSummaryPage;
