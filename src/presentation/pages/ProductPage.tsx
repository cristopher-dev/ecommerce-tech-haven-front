import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../../infrastructure/hooks/useCart";
import { useAppDispatch } from "@/application/store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/application/store/slices/wishlistSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/application/store/store";
import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // Get product ID from search params and convert numeric IDs to prod-X format
  const rawProductId = searchParams.get("id") || "1";
  const searchQuery = searchParams.get("search");
  const productId = /^\d+$/.test(rawProductId)
    ? `prod-${rawProductId}`
    : rawProductId;

  // Check if a product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const repo = new TechHavenApiProductRepository();

        if (searchQuery) {
          // Search mode: load all products and filter
          setIsSearchMode(true);
          const allProducts = await repo.getAll();
          const filtered = allProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          setProducts(filtered);
          setProduct(null);
        } else {
          // Single product mode
          setIsSearchMode(false);
          const data = await repo.getById(productId);
          setProduct(data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, searchQuery]);

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

  // Search results view
  if (isSearchMode) {
    return (
      <div>
        <Header />
        <main className="container my-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Search Results</li>
            </ol>
          </nav>

          <h2 className="mb-4">
            Search Results for "{searchQuery}"
            {products.length > 0 && (
              <span className="text-muted ms-2">({products.length} found)</span>
            )}
          </h2>

          {products.length === 0 ? (
            <div className="alert alert-info">
              No products found matching "{searchQuery}".{" "}
              <Link to="/">Back to Home</Link>
            </div>
          ) : (
            <div className="row">
              {products.map((p) => (
                <div key={p.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={p.imageUrl}
                        className="card-img-top"
                        alt={p.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <button
                        className="btn btn-sm"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: isInWishlist(p.id)
                            ? "#ff6b6b"
                            : "rgba(255,255,255,0.9)",
                          color: isInWishlist(p.id) ? "white" : "#333",
                          border: "none",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          if (isInWishlist(p.id)) {
                            dispatch(removeFromWishlist(parseInt(p.id)));
                          } else {
                            dispatch(addToWishlist(p as any));
                          }
                        }}
                        title={
                          isInWishlist(p.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <i
                          className={`bi ${
                            isInWishlist(p.id) ? "bi-heart-fill" : "bi-heart"
                          }`}
                          style={{ fontSize: "18px" }}
                        ></i>
                      </button>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="text-muted small">{p.description}</p>
                      <p className="card-text text-success fw-bold">
                        ${(p.price / 100).toFixed(2)}
                      </p>
                      <small className="text-muted">
                        Stock: {p.stock} units
                      </small>
                    </div>
                    <div className="card-footer bg-transparent d-grid gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          addToCart(
                            {
                              id: parseInt(p.id),
                              name: p.name,
                              price: p.price / 100,
                              image: p.imageUrl,
                              discount: 0,
                            },
                            1,
                          );
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                        disabled={p.stock === 0}
                      >
                        {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <Link
                        to={`/product?id=${p.id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Single product view
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
