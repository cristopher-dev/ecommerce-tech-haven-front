import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../../infrastructure/hooks/useCart";

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const product = {
    id: 1,
    name: "Product Name",
    price: 99.0,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    discount: 0,
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Simulate delay for UX
    setTimeout(() => {
      setIsAdding(false);
      navigate("/cart");
    }, 500);
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
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </main>
      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div className="toast show" role="alert">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">Product added to cart!</div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductPage;
