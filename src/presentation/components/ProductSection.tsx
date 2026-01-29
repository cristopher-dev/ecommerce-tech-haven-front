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
        console.error("Error loading products:", err);
        setError("Failed to load products");
        // Fallback to mock products
        setProducts([
          {
            id: "1",
            name: "Wireless Headphones",
            price: 9999,
            stock: 50,
            description: "High-quality wireless headphones",
            imageUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "2",
            name: "Smartphone",
            price: 69999,
            stock: 30,
            description: "Latest smartphone model",
            imageUrl:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "3",
            name: "Laptop",
            price: 129999,
            stock: 20,
            description: "Powerful laptop for work",
            imageUrl:
              "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "4",
            name: "Tablet",
            price: 39999,
            stock: 40,
            description: "Portable tablet device",
            imageUrl:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "5",
            name: "Smart Watch",
            price: 24999,
            stock: 60,
            description: "Wearable smart watch",
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "6",
            name: "Bluetooth Speaker",
            price: 7999,
            stock: 80,
            description: "Portable bluetooth speaker",
            imageUrl:
              "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
        ]);
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
                  id: parseInt(product.id),
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
