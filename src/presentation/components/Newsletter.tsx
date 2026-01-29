import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates and exclusive offers</p>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form className="d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Enter your email"
              />
              <button className="btn btn-primary" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
