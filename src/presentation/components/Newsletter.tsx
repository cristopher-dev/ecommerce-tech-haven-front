import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0066ff 0%, #0052cc 100%)",
        padding: "3rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          transform: "translate(100px, -50px)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          transform: "translate(-50px, 50px)",
        }}
      ></div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              marginBottom: "1rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            📬 {t("footer.newsletter")}
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              opacity: 0.9,
            }}
          >
            {t("newsletter.description")}
          </p>

          <div className="row justify-content-center">
            <div className="col-md-6">
              <form
                className="d-flex gap-2"
                onSubmit={handleSubmit}
                style={{
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "white",
                }}
              >
                <input
                  type="email"
                  className="form-control"
                  placeholder={t("common.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    border: "none",
                    padding: "1rem",
                    fontSize: "1rem",
                  }}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{
                    borderRadius: "0",
                    padding: "0 2rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  ✉️ {t("common.submit")}
                </button>
              </form>
              {submitted && (
                <div
                  style={{
                    marginTop: "1rem",
                    color: "white",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  ✅ {t("newsletter.thanks")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
