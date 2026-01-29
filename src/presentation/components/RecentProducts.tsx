import React from "react";
import ProductCard from "@/presentation/components/ProductCard";

const RecentProducts: React.FC = () => {
  // Mock recent products with discounts
  const recentProducts = [
    {
      id: 1,
      name: "HD Camera",
      price: 199.0,
      originalPrice: 129.0,
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 35,
      rating: 5,
    },
    {
      id: 2,
      name: "Black Watches",
      price: 199.0,
      originalPrice: 129.0,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 35,
      rating: 5,
    },
    {
      id: 3,
      name: "USB Speaker",
      price: 596.0,
      originalPrice: 68.0,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 89,
      rating: 5,
    },
    {
      id: 4,
      name: "Classic Earphone",
      price: 596.0,
      originalPrice: 68.0,
      image:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 89,
      rating: 5,
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      price: 59.0,
      originalPrice: 49.0,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
      discount: 17,
      rating: 5,
    },
  ];

  return (
    <section className="recent-products py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">Recent Products</h2>
          </div>
        </div>
        <div className="row">
          {recentProducts.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="product-card position-relative">
                {product.discount > 0 && (
                  <div
                    className="badge bg-danger position-absolute"
                    style={{ top: "10px", left: "10px", zIndex: 1 }}
                  >
                    -{product.discount}%
                  </div>
                )}
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

export default RecentProducts;
