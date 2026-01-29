import React from "react";
import ProductCard from "./ProductCard";

const TopRatedProducts: React.FC = () => {
  // Mock top rated products
  const topRatedProducts = [
    {
      id: 1,
      name: "Casual Blue Shoes",
      price: 101.0,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 0,
    },
    {
      id: 2,
      name: "HD Camera",
      price: 299.0,
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 33,
    },
    {
      id: 3,
      name: "1080p Wifi IP Camera",
      price: 596.0,
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 34,
    },
    {
      id: 4,
      name: "Laptop Case Bag",
      price: 1999.0,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 17,
    },
    {
      id: 5,
      name: "Black Shoes",
      price: 101.0,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 0,
    },
    {
      id: 6,
      name: "Smart Watches",
      price: 299.0,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 0,
    },
  ];

  return (
    <section className="top-rated-products py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">Top Rated Products</h2>
          </div>
        </div>
        <div className="row">
          {topRatedProducts.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="product-card position-relative">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary me-2">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopRatedProducts;
