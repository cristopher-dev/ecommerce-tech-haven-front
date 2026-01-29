import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../infrastructure/hooks/useCart";
import "./Header.scss";

const Header: React.FC = () => {
  const { getTotalItems, cart } = useCart();

  const getCartTotal = () => {
    return cart.items
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top bg-dark text-white py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="header-top-left">
                <span className="me-3">
                  <i className="bi bi-telephone me-1"></i>
                  Call us: +1 234 567 890
                </span>
                <span>
                  <i className="bi bi-envelope me-1"></i>
                  support@techhaven.com
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="header-top-right d-flex justify-content-end align-items-center">
                <div className="dropdown me-3">
                  <button
                    className="btn btn-link text-white p-0 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-translate me-1"></i> ENG
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        English
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Español
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Français
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown me-3">
                  <button
                    className="btn btn-link text-white p-0 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-currency-dollar me-1"></i> USD
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        USD
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        EUR
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        GBP
                      </a>
                    </li>
                  </ul>
                </div>
                <a href="#" className="text-white text-decoration-none">
                  <i className="bi bi-shop me-1"></i> Become a Seller
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main bg-white border-bottom">
        <div className="container">
          <div className="row align-items-center py-3">
            {/* Logo */}
            <div className="col-lg-2 col-md-3">
              <Link className="navbar-brand d-block" to="/">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=50&q=80"
                  alt="TechHaven"
                  className="img-fluid"
                  style={{ maxBlockSize: "50px" }}
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="col-lg-5 col-md-6">
              <form className="search-form">
                <div className="input-group">
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle border-end-0"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-grid me-1"></i> All Categories
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          All Categories
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Electronics
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Fashion
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Home & Garden
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Sports
                        </a>
                      </li>
                    </ul>
                  </div>
                  <input
                    type="search"
                    className="form-control border-start-0 border-end-0"
                    placeholder="Search for products..."
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* User Actions */}
            <div className="col-lg-5 col-md-3">
              <div className="header-actions d-flex justify-content-end align-items-center gap-3">
                <div className="header-action">
                  <Link
                    to="/account"
                    className="text-decoration-none d-flex align-items-center"
                  >
                    <div className="action-icon me-2">
                      <i className="bi bi-person-circle fs-4 text-primary"></i>
                    </div>
                    <div className="action-text d-none d-lg-block">
                      <div className="fw-bold">My Account</div>
                      <small className="text-muted">Login/Register</small>
                    </div>
                  </Link>
                </div>

                <div className="header-action">
                  <Link
                    to="/wishlist"
                    className="text-decoration-none d-flex align-items-center"
                  >
                    <div className="action-icon me-2 position-relative">
                      <i className="bi bi-heart fs-4 text-danger"></i>
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle badge-sm">
                        3
                      </span>
                    </div>
                    <div className="action-text d-none d-lg-block">
                      <div className="fw-bold">Wishlist</div>
                      <small className="text-muted">Your favorites</small>
                    </div>
                  </Link>
                </div>

                <div className="header-action">
                  <div className="dropdown">
                    <button
                      className="btn btn-link text-decoration-none d-flex align-items-center p-0"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <div className="action-icon me-2 position-relative">
                        <i className="bi bi-cart3 fs-4 text-success"></i>
                        <span className="badge bg-success position-absolute top-0 start-100 translate-middle badge-sm">
                          {getTotalItems()}
                        </span>
                      </div>
                      <div className="action-text d-none d-lg-block">
                        <div className="fw-bold">${getCartTotal()}</div>
                        <small className="text-muted">Your cart</small>
                      </div>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end cart-dropdown"
                      style={{ minInlineSize: "350px" }}
                    >
                      {cart.items.length === 0 ? (
                        <li>
                          <div className="p-4 text-center">
                            <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
                            <p className="text-muted mb-0">
                              Your cart is empty
                            </p>
                          </div>
                        </li>
                      ) : (
                        <>
                          {cart.items.slice(0, 3).map((item) => (
                            <li key={item.product.id}>
                              <div className="p-3 d-flex align-items-center">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="me-3 rounded"
                                  style={{
                                    inlineSize: "50px",
                                    blockSize: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{item.product.name}</h6>
                                  <p className="mb-1 text-primary fw-bold">
                                    ${item.product.price} × {item.quantity}
                                  </p>
                                </div>
                                <button className="btn btn-sm btn-outline-danger">
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            </li>
                          ))}
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <strong>SUBTOTAL:</strong>
                                <span className="text-primary fw-bold">
                                  ${getCartTotal()}
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                <Link
                                  className="btn btn-outline-primary flex-fill"
                                  to="/cart"
                                >
                                  View Cart
                                </Link>
                                <Link
                                  className="btn btn-primary flex-fill"
                                  to="/checkout"
                                >
                                  Checkout
                                </Link>
                              </div>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <div className="d-flex align-items-center w-100">
            {/* Shop by Category */}
            <div className="dropdown me-4">
              <button
                className="btn btn-primary dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-list me-2"></i>
                Shop by Category
              </button>
              <ul className="dropdown-menu category-dropdown">
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-house me-3 fs-5 text-primary"></i>
                    <span>Home & Garden</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-shirt me-3 fs-5 text-success"></i>
                    <span>Fashion</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-laptop me-3 fs-5 text-info"></i>
                    <span>Electronics</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-gift me-3 fs-5 text-warning"></i>
                    <span>Gifts</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-tree me-3 fs-5 text-success"></i>
                    <span>Garden</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-music-note me-3 fs-5 text-danger"></i>
                    <span>Music</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-car-front me-3 fs-5 text-secondary"></i>
                    <span>Motors</span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-house-gear me-3 fs-5 text-dark"></i>
                    <span>Furniture</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item fw-bold text-primary" href="#">
                    VIEW ALL CATEGORIES{" "}
                    <i className="bi bi-chevron-right ms-2"></i>
                  </a>
                </li>
              </ul>
            </div>

            {/* Main Navigation */}
            <div className="navbar-nav flex-row">
              <Link className="nav-link me-3" to="/">
                Home
              </Link>
              <a className="nav-link me-3" href="#">
                Vendor
              </a>
              <a className="nav-link me-3" href="#">
                Categories
              </a>
              <Link className="nav-link me-3" to="/product">
                Products
              </Link>
              <a className="nav-link me-3" href="#">
                Blog
              </a>
              <a className="nav-link" href="#">
                Pages
              </a>
            </div>

            {/* Quick Search Tags */}
            <div className="ms-auto d-none d-lg-flex align-items-center">
              <span className="text-muted me-3">Popular:</span>
              <a
                href="#"
                className="badge bg-light text-dark text-decoration-none me-2"
              >
                electronics
              </a>
              <a
                href="#"
                className="badge bg-light text-dark text-decoration-none me-2"
              >
                fashion
              </a>
              <a
                href="#"
                className="badge bg-light text-dark text-decoration-none me-2"
              >
                hub
              </a>
              <a
                href="#"
                className="badge bg-light text-dark text-decoration-none me-2"
              >
                shirt
              </a>
              <a
                href="#"
                className="badge bg-light text-dark text-decoration-none me-2"
              >
                skirt
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
