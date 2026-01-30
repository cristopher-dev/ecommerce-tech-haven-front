import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useWishlist,
  useCartItems,
  useAppDispatch,
} from "@/application/store/hooks";
import { removeFromCart } from "@/application/store/slices/cartSlice";
import {
  logout,
  setUser,
  setToken,
} from "@/application/store/slices/authSlice";
import { RootState } from "@/application/store/store";
import "@/styles/components/Header.scss";

const Header: React.FC = () => {
  const { totalItems, total, items } = useCartItems();
  const { count: wishlistCount } = useWishlist();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMockLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@techhaven.com",
          password: "admin123",
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Set user data with real token from API
      const userData = {
        id: "admin-user",
        email: data.email,
        firstName: "Admin",
        lastName: "User",
        role: data.role as "ADMIN" | "USER",
        phone: "123456789",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(setUser(userData));
      dispatch(setToken(data.token));
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#headerCollapse"
            aria-controls="headerCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="headerCollapse">
            <div className="w-100">
              <div className="header-main bg-white border-bottom">
                <div className="row align-items-center py-2 py-md-3">
                  {/* Logo */}
                  <div className="col-6 col-md-3 col-lg-2 d-flex justify-content-center align-items-center">
                    <Link className="navbar-brand d-block" to="/">
                      <img
                        alt="TechHaven"
                        className="img-fluid"
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                        style={{
                          maxHeight: "50px",
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          borderRadius: "12px",
                        }}
                      />
                    </Link>
                  </div>

                  {/* Search Bar */}
                  <div className="col-12 col-md-6 col-lg-5">
                    <form
                      className="search-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const searchInput = e.currentTarget.querySelector(
                          'input[type="search"]',
                        ) as HTMLInputElement;
                        if (searchInput?.value) {
                          navigate(
                            `/product?search=${encodeURIComponent(searchInput.value)}`,
                          );
                        }
                      }}
                    >
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
                          <i className="bi bi-search me-2"></i>Search
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* User Actions - Better UI */}
                  <div className="col-6 col-md-3 col-lg-5">
                    <div className="header-actions d-flex justify-content-end align-items-center gap-1 gap-md-2">
                      {/* My Account / Auth */}
                      {user ? (
                        <div className="dropdown">
                          <button
                            className="btn d-flex align-items-center justify-content-center justify-content-lg-start py-2 px-2 px-lg-3 position-relative"
                            type="button"
                            data-bs-toggle="dropdown"
                            style={{
                              minHeight: "44px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              transition: "background-color 0.3s",
                              color: "inherit",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <i className="bi bi-person-circle fs-5 text-primary"></i>
                            <div className="ms-2 d-none d-lg-block">
                              <small
                                className="text-muted d-block lh-1"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Account
                              </small>
                              <span
                                className="fw-600 d-block lh-1"
                                style={{ fontSize: "0.85rem" }}
                              >
                                {user.firstName}
                              </span>
                            </div>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <span className="dropdown-item-text">
                                <strong>
                                  {user.firstName} {user.lastName}
                                </strong>
                                <br />
                                <small className="text-muted">
                                  {user.email}
                                </small>
                              </span>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/account/profile"
                              >
                                <i className="bi bi-person me-2"></i>My Profile
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to="/account/orders"
                              >
                                <i className="bi bi-bag me-2"></i>My Orders
                              </Link>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={handleLogout}
                              >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Logout
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button
                          onClick={handleMockLogin}
                          className="btn btn-outline-primary d-flex align-items-center justify-content-center justify-content-lg-start py-2 px-2 px-lg-3"
                          style={{
                            minHeight: "44px",
                            borderRadius: "8px",
                          }}
                          title="Demo: Click to login as Admin"
                        >
                          <i className="bi bi-person-circle fs-5 text-primary"></i>
                          <div className="ms-2 d-none d-lg-block">
                            <small
                              className="text-muted d-block lh-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Account
                            </small>
                            <span
                              className="fw-600 d-block lh-1"
                              style={{ fontSize: "0.85rem" }}
                            >
                              Login
                            </span>
                          </div>
                        </button>
                      )}

                      {/* Wishlist */}
                      <Link
                        to="/wishlist"
                        className="header-action d-flex align-items-center justify-content-center justify-content-lg-start py-2 px-2 px-lg-3 position-relative"
                        style={{
                          minHeight: "44px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          transition: "background-color 0.3s",
                          color: "inherit",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <div className="position-relative">
                          <i className="bi bi-heart fs-5 text-danger"></i>
                          {wishlistCount > 0 && (
                            <span
                              className="badge bg-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "18px",
                                height: "18px",
                                fontSize: "0.6rem",
                                padding: "0",
                              }}
                            >
                              {wishlistCount}
                            </span>
                          )}
                        </div>
                        <div className="ms-2 d-none d-lg-block">
                          <small
                            className="text-muted d-block lh-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Favorites
                          </small>
                          <span
                            className="fw-600 d-block lh-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Wishlist
                          </span>
                        </div>
                      </Link>

                      {/* Shopping Cart */}
                      <div
                        className="header-action dropdown d-flex align-items-center"
                        style={{ minHeight: "44px" }}
                      >
                        <button
                          className="btn d-flex align-items-center justify-content-center justify-content-lg-start py-2 px-2 px-lg-3 position-relative"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            minHeight: "44px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f5f5f5")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <div className="position-relative">
                            <i className="bi bi-bag fs-5 text-success"></i>
                            <span
                              className="badge bg-success rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "18px",
                                height: "18px",
                                fontSize: "0.6rem",
                                padding: "0",
                              }}
                            >
                              {totalItems}
                            </span>
                          </div>
                          <div className="ms-2 d-none d-lg-block">
                            <small
                              className="text-muted d-block lh-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Cart Total
                            </small>
                            <span
                              className="fw-600 d-block lh-1 text-success"
                              style={{ fontSize: "0.85rem" }}
                            >
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </button>

                        {/* Cart Dropdown Menu */}
                        <ul
                          className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                          style={{
                            minWidth: "350px",
                            maxHeight: "500px",
                            overflowY: "auto",
                            borderRadius: "8px",
                          }}
                        >
                          <li className="p-3 border-bottom bg-light rounded-top-3">
                            <h6 className="mb-0 fw-bold">
                              <i className="bi bi-bag me-2 text-success"></i>
                              Shopping Cart
                            </h6>
                          </li>

                          {items.length === 0 ? (
                            <li>
                              <div className="p-4 text-center">
                                <i className="bi bi-bag-x fs-1 text-muted mb-3 d-block"></i>
                                <p className="text-muted mb-0">
                                  Your cart is empty
                                </p>
                              </div>
                            </li>
                          ) : (
                            <>
                              {items.slice(0, 3).map((item) => (
                                <li
                                  key={item.product.id}
                                  className="border-bottom"
                                >
                                  <div className="p-3 d-flex align-items-center gap-2">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="rounded"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div
                                      className="flex-grow-1"
                                      style={{ minWidth: "0" }}
                                    >
                                      <h6 className="mb-1 text-truncate">
                                        {item.product.name}
                                      </h6>
                                      <p
                                        className="mb-0 text-success fw-bold"
                                        style={{ fontSize: "0.9rem" }}
                                      >
                                        ${item.product.price} × {item.quantity}
                                      </p>
                                    </div>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        dispatch(
                                          removeFromCart(item.product.id),
                                        )
                                      }
                                    >
                                      <i className="bi bi-x"></i>
                                    </button>
                                  </div>
                                </li>
                              ))}

                              <li className="p-3">
                                <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                  <strong>Subtotal:</strong>
                                  <span className="text-success fw-bold">
                                    ${total.toFixed(2)}
                                  </span>
                                </div>
                                <div className="d-flex gap-2">
                                  <Link
                                    className="btn btn-sm btn-outline-primary flex-fill"
                                    to="/cart"
                                  >
                                    View Cart
                                  </Link>
                                  <Link
                                    className="btn btn-sm btn-success flex-fill"
                                    to="/checkout"
                                  >
                                    Checkout
                                  </Link>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
