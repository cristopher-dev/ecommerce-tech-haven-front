import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Features: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      id: "shipping",
      icon: "🚚",
      title: t("features.freeShippingTitle"),
      desc: t("features.freeShippingDesc"),
      color: "#0066ff",
    },
    {
      id: "money-back",
      icon: "💰",
      title: t("features.moneyBackTitle"),
      desc: t("features.moneyBackDesc"),
      color: "#10b981",
    },
    {
      id: "support",
      icon: "💬",
      title: t("features.supportTitle"),
      desc: t("features.supportDesc"),
      color: "#f59e0b",
    },
    {
      id: "secure",
      icon: "🔒",
      title: t("features.secureTitle"),
      desc: t("features.secureDesc"),
      color: "#ef4444",
    },
  ];

  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        padding: "3rem 0",
      }}
    >
      <div className="container">
        <div className="row">
          {features.map((feature) => (
            <div key={feature.id} className="col-md-3 col-sm-6 mb-4">
              <button
                type="button"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() =>
                  setHoveredFeature(
                    hoveredFeature === feature.id ? null : feature.id,
                  )
                }
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    hoveredFeature === feature.id
                      ? "translateY(-8px) scale(1.02)"
                      : "translateY(0) scale(1)",
                  border:
                    hoveredFeature === feature.id
                      ? `2px solid ${feature.color}`
                      : "2px solid transparent",
                  width: "100%",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    transition: "transform 0.3s ease",
                    transform:
                      hoveredFeature === feature.id
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
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
