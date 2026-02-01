import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const linkStyle = (key: string) => ({
    color: hoveredLink === key ? "#0066ff" : "#b0b0b0",
    transition: "all 0.3s ease",
    display: "block",
    marginBottom: "0.75rem",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    background: "none",
    padding: 0,
  });

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
        color: "white",
        padding: "3rem 0 1rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container">
        <div className="row mb-4">
          {/* Brand Section */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #0066ff, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
              }}
            >
              🏪 TechHaven
            </div>
            <p style={{ color: "#b0b0b0", lineHeight: "1.6" }}>
              {t("footer.description")}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { icon: "facebook", color: "#0A66C2" },
                { icon: "twitter", color: "#1DA1F2" },
                { icon: "instagram", color: "#E4405F" },
                { icon: "youtube", color: "#FF0000" },
              ].map((social) => (
                <button
                  key={social.icon}
                  type="button"
                  aria-label={social.icon}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: social.color,
                    transition: "all 0.3s ease",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className={`bi bi-${social.icon}`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6
              style={{
                fontWeight: "700",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "white",
              }}
            >
              📞 {t("footer.customerService")}
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { label: t("footer.contactUs"), icon: "✉️" },
                { label: t("footer.shippingInfo"), icon: "🚚" },
                { label: t("footer.returns"), icon: "↩️" },
                { label: t("footer.faq"), icon: "❓" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    style={linkStyle(item.label)}
                    onMouseEnter={() => setHoveredLink(item.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item.icon} {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6
              style={{
                fontWeight: "700",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "white",
              }}
            >
              👤 {t("footer.myAccount")}
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { label: t("footer.signIn"), icon: "🔐" },
                { label: t("footer.viewCart"), icon: "🛒" },
                { label: t("footer.myWishlist"), icon: "❤️" },
                { label: t("footer.trackOrder"), icon: "📦" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    style={linkStyle(item.label)}
                    onMouseEnter={() => setHoveredLink(item.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {item.icon} {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h6
              style={{
                fontWeight: "700",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "white",
              }}
            >
              💳 {t("footer.paymentMethods")}
            </h6>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {[
                { name: "Visa", emoji: "🏦" },
                { name: "Mastercard", emoji: "💳" },
                { name: "PayPal", emoji: "📱" },
                { name: "Apple Pay", emoji: "🍎" },
              ].map((payment) => (
                <button
                  key={payment.name}
                  type="button"
                  aria-label={payment.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 102, 255, 0.2)";
                    e.currentTarget.style.borderColor = "#0066ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.08)";
                  }}
                >
                  <span>{payment.emoji}</span>
                  {payment.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            margin: "2rem 0",
          }}
        ></div>

        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            color: "#b0b0b0",
            fontSize: "0.9rem",
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; 2024 TechHaven. All rights reserved. | Built with ❤️
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <button
              type="button"
              style={{
                color: "#b0b0b0",
                textDecoration: "none",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0066ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
            >
              {t("footer.privacyPolicy")}
            </button>
            <button
              type="button"
              style={{
                color: "#b0b0b0",
                textDecoration: "none",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0066ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
            >
              {t("footer.termsOfService")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
