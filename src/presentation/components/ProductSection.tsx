import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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
            <output aria-label="Loading products">
              <div className="spinner-border">
                <span className="visually-hidden">Loading...</span>
              </div>
            </output>
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
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProductSection;
