import React from "react";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title }) => {
  // Mock products
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://picsum.photos/300/300?random=headphones",
      discount: 10,
    },
    {
      id: 2,
      name: "Smartphone",
      price: 699.99,
      image: "https://picsum.photos/300/300?random=smartphone",
      discount: 0,
    },
    {
      id: 3,
      name: "Laptop",
      price: 1299.99,
      image: "https://picsum.photos/300/300?random=laptop",
      discount: 15,
    },
    {
      id: 4,
      name: "Tablet",
      price: 399.99,
      image: "https://picsum.photos/300/300?random=tablet",
      discount: 5,
    },
  ];

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
