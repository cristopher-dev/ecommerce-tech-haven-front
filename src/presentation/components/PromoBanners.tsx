import React from "react";

const PromoBanners: React.FC = () => {
  return (
    <section className="py-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="card border-0">
              <img
                src="https://picsum.photos/600/300?random=discount"
                className="card-img"
                alt="Promo 1"
              />
              <div className="card-img-overlay d-flex align-items-center">
                <div>
                  <h5 className="card-title text-white">Get 20% Off</h5>
                  <p className="card-text text-white">On your first purchase</p>
                  <button className="btn btn-light">Claim Now</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0">
              <img
                src="https://picsum.photos/600/300?random=deals"
                className="card-img"
                alt="Promo 2"
              />
              <div className="card-img-overlay d-flex align-items-center">
                <div>
                  <h5 className="card-title text-white">Exclusive Deals</h5>
                  <p className="card-text text-white">Limited time offers</p>
                  <button className="btn btn-light">Shop Now</button>
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
