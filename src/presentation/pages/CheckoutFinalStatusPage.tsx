import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutFinalStatusPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container my-4 text-center">
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
