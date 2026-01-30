import React from "react";
import { useTranslation } from "react-i18next";

const BrandCarousel: React.FC = () => {
  const { t } = useTranslation();
  const brands = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png",
    "https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png",
  ];

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4">{t("homePage.ourBrands")}</h2>
        <div
          id="brandCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="d-flex justify-content-around">
                {brands.slice(0, 4).map((brand) => (
                  <img
                    key={brand}
                    src={brand}
                    alt="Brand logo"
                    className="img-fluid"
                    style={{ maxHeight: "60px" }}
                  />
                ))}
              </div>
            </div>
            <div className="carousel-item">
              <div className="d-flex justify-content-around">
                {brands.slice(2, 6).map((brand) => (
                  <img
                    key={brand}
                    src={brand}
                    alt="Brand logo"
                    className="img-fluid"
                    style={{ maxHeight: "60px" }}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#brandCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#brandCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
