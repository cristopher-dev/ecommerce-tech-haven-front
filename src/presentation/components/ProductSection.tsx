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
            id: "prod-1",
            name: "Laptop Gaming Pro",
            price: 2500,
            stock: 10,
            description: "High-performance gaming laptop with RTX 4070",
            imageUrl:
              "https://images.unsplash.com/photo-1515705576902-9de428e8a6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-2",
            name: "Wireless Headphones",
            price: 299.99,
            stock: 25,
            description: "Noise-cancelling wireless headphones with 30h battery",
            imageUrl:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-3",
            name: "Smartphone Ultra",
            price: 1199,
            stock: 15,
            description: "Latest smartphone with 512GB storage and triple camera",
            imageUrl:
              "https://images.unsplash.com/photo-1511707267537-b85faf00021e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-4",
            name: "Mechanical Keyboard",
            price: 149.99,
            stock: 30,
            description: "RGB mechanical keyboard with blue switches",
            imageUrl:
              "https://images.unsplash.com/photo-1587829191301-ce8cdc4ecda9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-5",
            name: "4K Monitor 32\"",
            price: 699.99,
            stock: 8,
            description: "32-inch 4K UHD monitor with HDR support",
            imageUrl:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-6",
            name: "Smart Watch Pro",
            price: 399.99,
            stock: 20,
            description: "Fitness tracking smartwatch with heart rate monitor",
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-7",
            name: "USB-C Hub 7in1",
            price: 79.99,
            stock: 50,
            description: "Multi-port USB-C hub with HDMI and SD card reader",
            imageUrl:
              "https://images.unsplash.com/photo-1625948515291-69613efd103f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-8",
            name: "Wireless Mouse",
            price: 49.99,
            stock: 40,
            description: "Silent ergonomic wireless mouse",
            imageUrl:
              "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-9",
            name: "Portable SSD 1TB",
            price: 129.99,
            stock: 35,
            description: "External solid state drive with 1050MB/s speed",
            imageUrl:
              "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-10",
            name: "Webcam 4K",
            price: 179.99,
            stock: 18,
            description: "Professional 4K webcam with auto focus",
            imageUrl:
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-11",
            name: "Tablet Pro 12.9\"",
            price: 1099,
            stock: 12,
            description: "Powerful tablet for creative professionals",
            imageUrl:
              "https://images.unsplash.com/photo-1526765260-f10f8aa7e745?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-12",
            name: "Bluetooth Speaker Premium",
            price: 199.99,
            stock: 28,
            description: "Waterproof premium speaker with 360° sound",
            imageUrl:
              "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-13",
            name: "Portable Charger 65W",
            price: 89.99,
            stock: 45,
            description: "Fast charging power bank with 30000mAh capacity",
            imageUrl:
              "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-14",
            name: "WiFi 6 Router",
            price: 299.99,
            stock: 14,
            description: "Ultra-fast WiFi 6 mesh router system",
            imageUrl:
              "https://images.unsplash.com/photo-1631862550519-c7bc9d1ee5f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-15",
            name: "Gaming Headset RGB",
            price: 149.99,
            stock: 32,
            description: "7.1 surround sound gaming headset with RGB",
            imageUrl:
              "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-16",
            name: "Mechanical Keyboard Wireless",
            price: 199.99,
            stock: 22,
            description: "Wireless mechanical keyboard with hot-swap switches",
            imageUrl:
              "https://images.unsplash.com/photo-1587829191301-ce8cdc4ecda9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-17",
            name: "27\" IPS Monitor",
            price: 449.99,
            stock: 9,
            description: "Professional IPS monitor with 100% sRGB coverage",
            imageUrl:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-18",
            name: "Graphics Tablet",
            price: 299.99,
            stock: 16,
            description: "Pressure-sensitive graphics tablet for artists",
            imageUrl:
              "https://images.unsplash.com/photo-1554866585-acbb2b90556e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-19",
            name: "Microphone Condenser",
            price: 199.99,
            stock: 19,
            description: "Studio-quality condenser microphone with shock mount",
            imageUrl:
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          },
          {
            id: "prod-20",
            name: "Laptop Cooling Pad",
            price: 59.99,
            stock: 55,
            description: "Aluminum laptop cooling pad with dual fans",
            imageUrl:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
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
export default ProductSection;