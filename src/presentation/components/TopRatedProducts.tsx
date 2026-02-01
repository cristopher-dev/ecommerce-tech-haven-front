import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";
import ProductCard from "@/presentation/components/ProductCard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TopRatedProducts: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const repo = new TechHavenApiProductRepository();
        const data = await repo.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        // Silently handle 401 Unauthorized errors - products require authentication
        if (err instanceof Error && err.message.includes("401")) {
          setError(null); // Don't show error, allow fallback rendering
        } else {
          console.error("Error loading top rated products:", err);
          setError("Failed to load products");
        }
        // Fallback mock data
        const mockProducts: ProductDTO[] = [
          {
            id: "prod-1",
            name: "Casual Blue Shoes",
            price: 10100,
            stock: 20,
            description: "Comfortable casual blue shoes",
            imageUrl:
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 0,
          },
          {
            id: "prod-2",
            name: "HD Camera",
            price: 29900,
            stock: 15,
            description: "High-definition camera",
            imageUrl:
              "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 15,
          },
          {
            id: "prod-3",
            name: "1080p Wifi IP Camera",
            price: 59600,
            stock: 10,
            description: "Wireless IP security camera",
            imageUrl:
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 0,
          },
          {
            id: "prod-4",
            name: "Laptop Case Bag",
            price: 199900,
            stock: 25,
            description: "Professional laptop carrying case",
            imageUrl:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 15,
          },
          {
            id: "prod-5",
            name: "Black Shoes",
            price: 10100,
            stock: 18,
            description: "Classic black shoes",
            imageUrl:
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 0,
          },
          {
            id: "prod-6",
            name: "Smart Watches",
            price: 29900,
            stock: 22,
            description: "Modern smartwatch with health tracking",
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            discount: 15,
          },
        ];
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Transform products to match ProductCard expectations
  const topRatedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price / 100,
    stock: product.stock,
    imageUrl:
      product.imageUrl || "https://via.placeholder.com/300x300?text=Product",
    discount: product.discount,
  }));

  return (
    <section className="top-rated-products py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">
              {t("homePage.topRatedProducts")}
            </h2>
          </div>
        </div>
        {loading && (
          <div className="text-center">
            <div
              className="spinner-border"
              aria-live="polite"
              aria-label="Loading products"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}
        {!loading && (
          <>
            <div className="row">
              {topRatedProducts.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 mb-4">
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
          </>
        )}
      </div>
    </section>
  );
};

export default TopRatedProducts;
