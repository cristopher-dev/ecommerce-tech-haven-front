import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/domain/entities/Product";
import { useAppDispatch } from "@/application/store/hooks";
import { addToCart } from "@/application/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/application/store/slices/wishlistSlice";
import { useWishlist } from "@/application/store/hooks";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useWishlist();
  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id,
  );
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setTimeout(() => {
      navigate("/checkout/delivery");
    }, 300);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return (
    <div
      className="card h-100 border-0 product-card-modern"
      style={{
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 102, 255, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
      }}
    >
      <div
        className="position-relative"
        style={{
          overflow: "hidden",
          borderRadius: "12px 12px 0 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          style={{
            transition: "transform 0.3s ease",
            objectFit: "cover",
            aspectRatio: "1/1",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {product.discount > 0 && (
          <span
            className="badge position-absolute top-0 start-0 m-3"
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #e64c00 100%)",
              fontSize: "0.85rem",
              fontWeight: "700",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            🔥 -{product.discount}%
          </span>
        )}
        <div
          className="card-img-overlay d-flex justify-content-end align-items-start p-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
          }}
        >
          <button
            className="btn btn-sm rounded-circle"
            onClick={handleToggleWishlist}
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
            style={{
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: isHeartHovered
                ? "scale(1.25) rotate(8deg)"
                : "scale(1)",
              background: isInWishlist
                ? "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)"
                : "rgba(255, 255, 255, 0.9)",
              color: isInWishlist ? "white" : "#ff6b35",
              border: "2px solid",
              borderColor: isInWishlist
                ? "transparent"
                : "rgba(255, 107, 53, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: isInWishlist
                ? "0 6px 20px rgba(255, 107, 53, 0.35)"
                : "0 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "0.5rem",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label={
              isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
            }
          >
            <i className={`bi bi-heart${isInWishlist ? "-fill" : ""}`}></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <h6
          className="card-title"
          style={{
            color: "#1a1a2e",
            fontWeight: "600",
            fontSize: "0.95rem",
            lineHeight: "1.3",
            minHeight: "2.6em",
            marginBottom: "0.75rem",
          }}
        >
          {product.name}
        </h6>
        <div className="d-flex align-items-center mb-2">
          <span className="text-muted me-2">
            <i className="bi bi-star-fill" style={{ color: "#ffc107" }}></i>
            <i className="bi bi-star-fill" style={{ color: "#ffc107" }}></i>
            <i className="bi bi-star-fill" style={{ color: "#ffc107" }}></i>
            <i className="bi bi-star-fill" style={{ color: "#ffc107" }}></i>
            <i className="bi bi-star-half" style={{ color: "#ffc107" }}></i>
          </span>
          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
            (4.5)
          </small>
        </div>
        <div className="d-flex align-items-center gap-2">
          {product.discount > 0 && (
            <span
              className="text-muted text-decoration-line-through"
              style={{ fontSize: "0.85rem" }}
            >
              ${product.price.toFixed(2)}
            </span>
          )}
          <span
            className="fw-bold"
            style={{
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #0066ff, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="card-footer bg-white border-0 pt-0">
        <button
          className="btn w-100 mb-2"
          onClick={handleAddToCart}
          style={{
            background: "linear-gradient(135deg, #0066ff 0%, #0052cc 100%)",
            color: "white",
            fontWeight: "600",
            border: "none",
            padding: "0.75rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(0, 102, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <i className="bi bi-bag-plus me-2"></i>Add to Cart
        </button>
        <button
          className="btn btn-success w-100"
          onClick={handleBuyNow}
          style={{
            fontWeight: "600",
            border: "none",
            padding: "0.75rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(40, 167, 69, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <i className="bi bi-cart-check me-1"></i>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
