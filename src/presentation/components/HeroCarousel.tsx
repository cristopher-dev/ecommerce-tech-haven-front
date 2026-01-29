import React from "react";

const HeroCarousel: React.FC = () => {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80"
            className="d-block w-100"
            alt="Hero 1"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5>Welcome to TechHaven</h5>
            <p>Discover the latest in technology</p>
            <button className="btn btn-primary">Shop Now</button>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80"
            className="d-block w-100"
            alt="Hero 2"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5>Exclusive Deals</h5>
            <p>Up to 50% off on selected items</p>
            <button className="btn btn-primary">View Deals</button>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default HeroCarousel;
