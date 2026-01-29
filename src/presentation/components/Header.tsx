import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      {/* Top Bar */}
      <div className="bg-dark text-white py-1">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <span>English | USD</span>
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
          <a className="navbar-brand" href="#">
            <img
              src="https://picsum.photos/100/40?random=logo"
              alt="TechHaven"
              height="40"
            />
          </a>
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
                <a className="nav-link" href="#">
                  Products
                </a>
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
            <form className="d-flex me-3">
              <input
                className="form-control"
                type="search"
                placeholder="Search..."
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
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
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="cartDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-cart"></i> Cart (0)
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="p-3">Your cart is empty</div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
