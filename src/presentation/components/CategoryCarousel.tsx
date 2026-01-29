import React from "react";

const CategoryCarousel: React.FC = () => {
  const categories = [
    {
      name: "Electronics",
      image: "https://picsum.photos/200/200?random=electronics",
    },
    {
      name: "Gadgets",
      image: "https://picsum.photos/200/200?random=gadgets",
    },
    {
      name: "Smart Home",
      image: "https://picsum.photos/200/200?random=smarthome",
    },
    {
      name: "Wearables",
      image: "https://picsum.photos/200/200?random=wearables",
    },
    {
      name: "Accessories",
      image: "https://picsum.photos/200/200?random=accessories",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="mb-4">Shop by Category</h2>
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
