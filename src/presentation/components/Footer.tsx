import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>TechHaven</h5>
            <p>Your one-stop shop for all tech needs.</p>
            <div>
              <i className="bi bi-facebook me-2"></i>
              <i className="bi bi-twitter me-2"></i>
              <i className="bi bi-instagram me-2"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
          <div className="col-md-3">
            <h6>Customer Service</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>My Account</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Sign In
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  View Cart
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  My Wishlist
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Track Order
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Payment Methods</h6>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
                alt="Visa"
                className="me-2"
                style={{ height: "30px" }}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/100px-MasterCard_Logo.svg.png"
                alt="Mastercard"
                className="me-2"
                style={{ height: "30px" }}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png"
                alt="PayPal"
                className="me-2"
                style={{ height: "30px" }}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; 2024 TechHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
