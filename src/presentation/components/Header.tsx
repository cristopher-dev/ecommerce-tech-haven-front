import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../infrastructure/hooks/useCart";

const Header: React.FC = () => {
  const { getTotalItems, cart } = useCart();

  const getCartTotal = () => {
    return cart.items
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };
  return (
    <header className="sticky-top">
      {/* Top Bar */}
      <div className="bg-dark text-white py-1">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <a href="#" className="text-white text-decoration-none me-3">
              ENG <i className="bi bi-chevron-down"></i>
            </a>
            <a href="#" className="text-white text-decoration-none">
              USD <i className="bi bi-chevron-down"></i>
            </a>
          </div>
          <div>
            <a href="#" className="text-white text-decoration-none">
              Become a Seller
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=40&q=80"
              alt="TechHaven"
              height="40"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Vendor
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="categoriesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Electronics
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Clothing
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Home & Garden
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pages
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Blog
                </a>
              </li>
            </ul>
            <form className="d-flex me-3 position-relative">
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  All Categories
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
                <input
                  className="form-control"
                  type="search"
                  placeholder="I'm searching for..."
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
            {/* Quick Search Tags */}
            <div
              className="d-flex flex-wrap gap-2 me-3"
              style={{ fontSize: "0.875rem" }}
            >
              <a href="#" className="text-decoration-none text-muted">
                electronics
              </a>
              <a href="#" className="text-decoration-none text-muted">
                fashion
              </a>
              <a href="#" className="text-decoration-none text-muted">
                hub
              </a>
              <a href="#" className="text-decoration-none text-muted">
                shirt
              </a>
              <a href="#" className="text-decoration-none text-muted">
                skirt
              </a>
              <a href="#" className="text-decoration-none text-muted">
                sports
              </a>
              <a href="#" className="text-decoration-none text-muted">
                sweater
              </a>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-person"></i> Account
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-heart"></i> Wishlist
                </a>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/cart"
                  id="cartDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-cart"></i> Cart ({getTotalItems()})
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  {cart.items.length === 0 ? (
                    <li>
                      <div className="p-3">Your cart is empty</div>
                    </li>
                  ) : (
                    <>
                      {cart.items.slice(0, 3).map((item) => (
                        <li key={item.product.id}>
                          <div className="p-2 d-flex align-items-center">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="me-2"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <div>
                              <div>{item.product.name}</div>
                              <div>
                                ${item.product.price} x {item.quantity}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <div className="p-2 d-flex justify-content-between align-items-center">
                          <strong>SUBTOTAL:</strong>
                          <span>${getCartTotal()}</span>
                        </div>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <div className="d-flex gap-2 p-2">
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
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Shop by Category Sidebar */}
      <div className="bg-light border-bottom">
        <div className="container">
          <div className="d-flex align-items-center py-2">
            <div className="dropdown me-4">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-list me-2"></i>
                Shop by Category
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-house me-2"></i>Home
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-shirt me-2"></i>Fashion
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-laptop me-2"></i>Electronics
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gift me-2"></i>Gifts
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-tree me-2"></i>Garden
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-music-note me-2"></i>Music
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-car-front me-2"></i>Motors
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-house-gear me-2"></i>Furniture
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item fw-bold" href="#">
                    VIEW ALL <i className="bi bi-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
            <nav className="navbar navbar-expand">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Vendor
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Categories
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/product">
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Blog
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Pages
                  </a>
                </li>
              </ul>
            </nav>
            <div className="ms-auto d-flex align-items-center gap-3">
              <a href="#" className="text-decoration-none">
                Become a Seller
              </a>
              <div className="dropdown">
                <a
                  href="#"
                  className="text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  USD <i className="bi bi-chevron-down"></i>
                </a>
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
              <div className="dropdown">
                <a
                  href="#"
                  className="text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  ENG <i className="bi bi-chevron-down"></i>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      ENG
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      ESP
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      FRA
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
