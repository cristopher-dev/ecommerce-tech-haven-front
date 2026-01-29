import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Product
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Product"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <h1>Product Name</h1>
            <p className="text-muted">$99.00</p>
            <p>Description of the product.</p>
            <button className="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
