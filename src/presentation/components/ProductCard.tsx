import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="position-relative">
        <img src={product.image} className="card-img-top" alt={product.name} />
        {product.discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            -{product.discount}%
          </span>
        )}
        <div className="card-img-overlay d-flex justify-content-end align-items-start p-2">
          <button className="btn btn-light btn-sm rounded-circle">
            <i className="bi bi-heart"></i>
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
        <button className="btn btn-primary w-100">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
