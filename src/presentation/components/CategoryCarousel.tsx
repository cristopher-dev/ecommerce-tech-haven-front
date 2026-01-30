import React from "react";
import { useTranslation } from "react-i18next";

const CategoryCarousel: React.FC = () => {
  const { t } = useTranslation();
  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      name: "Gadgets",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      name: "Smart Home",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      name: "Wearables",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="mb-4">{t("homePage.shopByCategory")}</h2>
        <div
          id="categoryCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="row">
                {categories.slice(0, 4).map((cat, index) => (
                  <div key={index} className="col-3">
                    <div className="card border-0 text-center">
                      <img
                        src={cat.image}
                        className="card-img-top rounded-circle"
                        alt={cat.name}
                      />
                      <div className="card-body">
                        <h6>{cat.name}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="carousel-item">
              <div className="row">
                {categories.slice(1, 5).map((cat, index) => (
                  <div key={index} className="col-3">
                    <div className="card border-0 text-center">
                      <img
                        src={cat.image}
                        className="card-img-top rounded-circle"
                        alt={cat.name}
                      />
                      <div className="card-body">
                        <h6>{cat.name}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#categoryCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
