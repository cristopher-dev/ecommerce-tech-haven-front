import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../../infrastructure/hooks/useCart";
import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = searchParams.get("id") || "1";

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const repo = new TechHavenApiProductRepository();
        const data = await repo.getById(productId);
        setProduct(data);
        // setError(null); // Error state not defined
      } catch (err) {
        console.error("Error loading product:", err);
        // setError("Failed to load product"); // Error state not defined
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(
      {
        id: parseInt(product.id),
        name: product.name,
        price: product.price / 100, // Convert cents to dollars
        image: product.imageUrl,
        discount: 0,
      },
      1,
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setTimeout(() => {
      setIsAdding(false);
      navigate("/cart");
    }, 500);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container my-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <main className="container my-4">
          <div className="alert alert-danger">
            Product not found. <Link to="/">Back to Home</Link>
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
            <li className="breadcrumb-item active" aria-current="page">
              Product
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} alt="Product" className="img-fluid" />
          </div>
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <p className="text-muted">${(product.price / 100).toFixed(2)}</p>
            <p className="text-success">
              Stock: {product.stock} units available
            </p>
            <p>{product.description}</p>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {isAdding ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Adding...
                  </>
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate("/checkout/delivery")}
                disabled={product.stock === 0}
              >
                <i className="bi bi-credit-card me-2"></i>
                Pay with Credit Card
              </button>
            </div>
          </div>
        </div>
      </main>
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <div
            className="toast show bg-success text-white"
            role="alert"
            style={{ animation: "slideInRight 0.5s ease-out" }}
          >
            <div className="toast-header bg-success text-white">
              <i className="bi bi-check-circle-fill me-2"></i>
              <strong className="me-auto">Added to Cart</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">
              <strong>{product.name}</strong> has been added to your cart!
              <br />
              <small>Redirecting to cart...</small>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductPage;
