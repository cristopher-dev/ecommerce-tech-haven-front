import React, { useState } from "react";

const Features: React.FC = () => {
  const features = [
    {
      icon: "🚚",
      title: "Free Shipping",
      desc: "On orders over $50",
      color: "#0066ff",
    },
    {
      icon: "💰",
      title: "Money Back Guarantee",
      desc: "30 days return policy",
      color: "#10b981",
    },
    {
      icon: "💬",
      title: "Online Support",
      desc: "24/7 customer service",
      color: "#f59e0b",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      desc: "100% secure transactions",
      color: "#ef4444",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        padding: "3rem 0",
      }}
    >
      <div className="container">
        <div className="row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="col-md-3 col-sm-6 mb-4"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    hoveredIndex === index
                      ? "translateY(-8px) scale(1.02)"
                      : "translateY(0) scale(1)",
                  border:
                    hoveredIndex === index
                      ? `2px solid ${feature.color}`
                      : "2px solid transparent",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    transition: "transform 0.3s ease",
                    transform:
                      hoveredIndex === index
                        ? "scale(1.2) rotate(10deg)"
                        : "scale(1)",
                  }}
                >
                  {feature.icon}
                </div>
                <h5
                  style={{
                    color: "#1a1a2e",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h5>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "0",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
