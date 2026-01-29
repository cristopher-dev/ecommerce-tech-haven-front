import React, { useState } from "react";
import { Product } from "@/domain/entities/Product";
import { useCart } from "@/infrastructure/hooks/useCart";
import { useAppDispatch } from "@/application/store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/application/store/slices/wishlistSlice";
import { useWishlist } from "@/application/store/hooks";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useWishlist();
  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id,
  );
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
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
      className="card h-100 border-0 shadow-sm"
      style={{ transition: "transform 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="position-relative">
        <img src={product.image} className="card-img-top" alt={product.name} />
        {product.discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{product.discount}%
          </span>
        )}
        <div className="card-img-overlay d-flex justify-content-end align-items-start p-2">
          <button
            className={`btn btn-sm rounded-circle ${isInWishlist ? "btn-danger" : "btn-light"}`}
            onClick={handleToggleWishlist}
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
            style={{
              transition: "all 0.2s ease",
              transform: isHeartHovered ? "scale(1.2)" : "scale(1)",
            }}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <i className={`bi bi-heart${isInWishlist ? "-fill" : ""}`}></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <h6 className="card-title">{product.name}</h6>
        <div className="d-flex align-items-center mb-2">
          <span className="text-muted me-2">
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-fill text-warning"></i>
            <i className="bi bi-star-half text-warning"></i>
          </span>
          <small className="text-muted">(4.5)</small>
        </div>
        <div className="d-flex align-items-center">
          {product.discount > 0 && (
            <span className="text-muted text-decoration-line-through me-2">
              ${product.price}
            </span>
          )}
          <span className="fw-bold">${discountedPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="card-footer bg-white border-0">
        <button className="btn btn-primary w-100" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
