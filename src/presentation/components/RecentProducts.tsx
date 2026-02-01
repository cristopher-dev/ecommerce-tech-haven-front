import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";
import ProductCard from "@/presentation/components/ProductCard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RecentProducts: React.FC = () => {
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
        setProducts(data.slice(0, 5));
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          setError(null); // Don't show error, allow fallback rendering
        } else {
          console.error("Error loading recent products:", err);
          setError("Failed to load recent products");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const recentProducts = products.map((product, index) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price / 100,
    stock: product.stock,
    imageUrl:
      product.imageUrl || "https://via.placeholder.com/300x300?text=Product",
    discount: (index % 3) * 10, // Vary discount for visual effect
  }));

  return (
    <section className="recent-products py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">{t("homePage.recentProducts")}</h2>
          </div>
        </div>
        {loading && (
          <div className="text-center">
            <div className="spinner-border" aria-label="Loading">
              <output></output>
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
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                >
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

export default RecentProducts;
