import React from "react";
import { useTranslation } from "react-i18next";

const HeroCarousel: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "0",
      }}
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div
            style={{
              position: "relative",
              background: "linear-gradient(135deg, #0066ff 0%, #0052cc 100%)",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80"
              className="d-block w-100"
              alt="Hero 1"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 2,
                color: "white",
                textAlign: "center",
                width: "100%",
                padding: "3rem 1rem",
              }}
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {t("homePage.welcome")}
              </h1>
              <p
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "2rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {t("homePage.discover")}
              </p>
              <button
                className="btn btn-light"
                style={{
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.2)";
                }}
              >
                🛍️ Shop Now
              </button>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div
            style={{
              position: "relative",
              background: "linear-gradient(135deg, #ff6b35 0%, #e64c00 100%)",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80"
              className="d-block w-100"
              alt="Hero 2"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 2,
                color: "white",
                textAlign: "center",
                width: "100%",
                padding: "3rem 1rem",
              }}
            >
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                ⚡ Exclusive Deals
              </h1>
              <p
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "2rem",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                Up to 50% off on selected items
              </p>
              <button
                className="btn btn-light"
                style={{
                  padding: "0.75rem 2rem",
                  fontWeight: "600",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.2)";
                }}
              >
                🔥 View Deals
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
        style={{
          width: "5%",
          background: "linear-gradient(90deg, rgba(0,0,0,0.3), transparent)",
          border: "none",
        }}
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
        style={{
          width: "5%",
          background: "linear-gradient(270deg, rgba(0,0,0,0.3), transparent)",
          border: "none",
        }}
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default HeroCarousel;
