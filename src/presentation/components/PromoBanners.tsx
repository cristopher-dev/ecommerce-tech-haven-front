import React from "react";
import { useTranslation } from "react-i18next";

const PromoBanners: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card border-0">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80"
                className="card-img"
                alt="Promo 1"
              />
              <div className="card-img-overlay d-flex align-items-center">
                <div>
                  <h5 className="card-title text-white">
                    {t("promoBanners.discount")}
                  </h5>
                  <p className="card-text text-white">
                    {t("promoBanners.firstPurchase")}
                  </p>
                  <button className="btn btn-light">
                    {t("promoBanners.claim")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80"
                className="card-img"
                alt="Promo 2"
              />
              <div className="card-img-overlay d-flex align-items-center">
                <div>
                  <h5 className="card-title text-white">
                    {t("promoBanners.exclusive")}
                  </h5>
                  <p className="card-text text-white">
                    {t("promoBanners.limitedTime")}
                  </p>
                  <button className="btn btn-light">
                    {t("promoBanners.shop")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
