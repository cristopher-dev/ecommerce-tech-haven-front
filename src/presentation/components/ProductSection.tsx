import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";

interface ProductSectionProps {
  title: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title }) => {
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
          console.error("Error loading products:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">{title}</h2>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn("Using fallback products due to API error");
  }

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4">{title}</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price / 100, // Convert cents to dollars
                  image: product.imageUrl,
                  discount: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProductSection;
