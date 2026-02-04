import { useAppDispatch, useCartItems, useWishlist } from '@/application/store/hooks';
import { logout, setToken, setUser } from '@/application/store/slices/authSlice';
import { removeFromCart } from '@/application/store/slices/cartSlice';
import { RootState } from '@/application/store/store';
import TechHavenLogo from '@/assets/TechHavenLogo.svg';
import '@/styles/components/Header.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { totalItems, total, items } = useCartItems();
  const { count: wishlistCount } = useWishlist();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLogout = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  const handleMockLogin = async () => {
    try {
      const demoEmail =
        (typeof process !== 'undefined' ? process.env.VITE_DEMO_EMAIL : undefined) ||
        'admin@techhaven.com';
      const demoPassword =
        (typeof process !== 'undefined' ? process.env.VITE_DEMO_PASSWORD : undefined) || 'admin123';

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: demoEmail,
          password: demoPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      const userData = {
        id: 'admin-user',
        email: data.email,
        firstName: 'Admin',
        lastName: 'User',
        role: data.role as 'ADMIN' | 'USER',
        phone: '123456789',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(setUser(userData));
      dispatch(setToken(data.token));
    } catch (error) {
      console.error('Login error:', error);
      alert(t('errors.loginFailed'));
    }
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-xl navbar-light bg-white border-bottom">
        <div className="container-fluid px-2 px-md-3">
          {/* Logo */}
          <Link className="navbar-brand d-inline-block flex-shrink-0 me-2 me-md-3" to="/">
            <img
              alt="TechHaven"
              className="img-fluid"
              src={TechHavenLogo}
              style={{
                width: '45px',
                height: '45px',
              }}
            />
          </Link>

          <button
            className="navbar-toggler border-0"
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
            {/* Search Bar - Takes more space on larger screens */}
            <form
              className="search-form flex-grow-1 mx-0 mx-xl-3"
              onSubmit={(e) => {
                e.preventDefault();
                const searchInput = e.currentTarget.querySelector(
                  'input[type="search"]'
                ) as HTMLInputElement;
                if (searchInput?.value) {
                  navigate(`/product?search=${encodeURIComponent(searchInput.value)}`);
                }
              }}
            >
              <div className="input-group">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle border-end-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <i className="bi bi-grid me-1"></i>
                    <span className="d-none d-md-inline">{t('header.categories')}</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate('/product?category=all')}
                      >
                        {t('header.allCategories')}
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate('/product?category=electronics')}
                      >
                        {t('header.electronics')}
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate('/product?category=fashion')}
                      >
                        {t('header.fashion')}
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate('/product?category=home-garden')}
                      >
                        {t('header.homeGarden')}
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate('/product?category=sports')}
                      >
                        {t('header.sports')}
                      </button>
                    </li>
                  </ul>
                </div>
                <input
                  type="search"
                  className="form-control border-start-0 border-end-0"
                  placeholder={t('header.search')}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-search me-2 d-none d-md-inline"></i>
                  <span className="d-none d-md-inline">{t('common.search')}</span>
                  <span className="d-md-none">🔍</span>
                </button>
              </div>
            </form>

            {/* User Actions */}
            <div className="header-actions d-flex justify-content-end align-items-center gap-1 gap-md-2 flex-nowrap mt-2 mt-xl-0">
              {/* My Account / Auth */}
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center justify-content-center py-2 px-2 px-md-3 position-relative"
                    type="button"
                    data-bs-toggle="dropdown"
                    style={{
                      minHeight: '44px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'background-color 0.3s',
                      color: 'inherit',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="bi bi-person-circle fs-5 text-primary"></i>
                    <div className="ms-2 d-none d-xl-block">
                      <small
                        className="text-muted d-block lh-1"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {t('common.account')}
                      </small>
                      <span className="fw-600 d-block lh-1" style={{ fontSize: '0.85rem' }}>
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
                        <small className="text-muted">{user.email}</small>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        {t('common.logout')}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={handleMockLogin}
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2 px-2 px-md-3"
                  style={{
                    minHeight: '44px',
                    borderRadius: '8px',
                  }}
                  title="Demo: Click to login as Admin"
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <div className="ms-2 d-none d-xl-block">
                    <span className="fw-600 d-block lh-1" style={{ fontSize: '0.85rem' }}>
                      {t('common.login')}
                    </span>
                  </div>
                </button>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="header-action d-flex align-items-center justify-content-center py-2 px-2 px-md-3 position-relative"
                style={{
                  minHeight: '44px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <div className="position-relative">
                  <i className="bi bi-heart fs-5 text-danger"></i>
                  {wishlistCount > 0 && (
                    <span
                      className="badge bg-danger rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.6rem',
                        padding: '0',
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <div className="ms-2 d-none d-xl-block">
                  <small className="text-muted d-block lh-1" style={{ fontSize: '0.7rem' }}>
                    {t('common.favorites')}
                  </small>
                  <span className="fw-600 d-block lh-1" style={{ fontSize: '0.85rem' }}>
                    {t('header.wishlist')}
                  </span>
                </div>
              </Link>

              {/* Purchases */}
              <Link
                to="/purchases"
                className="header-action d-flex align-items-center justify-content-center py-2 px-2 px-md-3 position-relative"
                style={{
                  minHeight: '44px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <div className="position-relative">
                  <i className="bi bi-bag-check fs-5 text-success"></i>
                </div>
                <div className="ms-2 d-none d-xl-block">
                  <small className="text-muted d-block lh-1" style={{ fontSize: '0.7rem' }}>
                    {t('common.orders') || 'Mis'}
                  </small>
                  <span className="fw-600 d-block lh-1" style={{ fontSize: '0.85rem' }}>
                    {t('header.purchases') || 'Compras'}
                  </span>
                </div>
              </Link>

              {/* Language Selector */}
              <div
                className="dropdown d-flex align-items-center"
                style={{ minHeight: '44px' }}
              >
                <button
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center py-2 px-2 px-md-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{
                    minHeight: '44px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                  title="Select Language"
                >
                  <i className="bi bi-globe me-1"></i>
                  <span className="d-none d-xl-inline">
                    {currentLanguage.toUpperCase()}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className={`dropdown-item ${currentLanguage === 'es' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('es')}
                    >
                      {currentLanguage === 'es' && <i className="bi bi-check-lg me-2"></i>}
                      Español
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${currentLanguage === 'en' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      {currentLanguage === 'en' && <i className="bi bi-check-lg me-2"></i>}
                      English
                    </button>
                  </li>
                </ul>
              </div>

              {/* Shopping Cart */}
              <div
                className="header-action dropdown d-flex align-items-center"
                style={{ minHeight: '44px' }}
              >
                <button
                  className="btn d-flex align-items-center justify-content-center py-2 px-2 px-md-3 position-relative"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    minHeight: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <div className="position-relative">
                    <i className="bi bi-bag fs-5 text-success"></i>
                    <span
                      className="badge bg-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.6rem',
                        padding: '0',
                      }}
                    >
                      {totalItems}
                    </span>
                  </div>
                  <div className="ms-2 d-none d-xl-block">
                    <small
                      className="text-muted d-block lh-1"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {t('cartPage.total')}
                    </small>
                    <span
                      className="fw-600 d-block lh-1 text-success"
                      style={{ fontSize: '0.85rem' }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </button>

                {/* Cart Dropdown Menu */}
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                  style={{
                    minWidth: '350px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    borderRadius: '8px',
                  }}
                >
                  <li
                    key="cart-header"
                    className="p-3 border-bottom bg-light rounded-top-3"
                  >
                    <h6 className="mb-0 fw-bold">
                      <i className="bi bi-bag me-2 text-success"></i>
                      {t('cartPage.title')}
                    </h6>
                  </li>

                  {items.length === 0 ? (
                    <li key="empty-cart">
                      <div className="p-4 text-center">
                        <i className="bi bi-bag-x fs-1 text-muted mb-3 d-block"></i>
                        <p className="text-muted mb-0">{t('cartPage.emptyCart')}</p>
                      </div>
                    </li>
                  ) : (
                    <>
                      {items.slice(0, 3).map((item, index) => (
                        <li
                          key={`cart-item-${item.product.id}-${index}`}
                          className="border-bottom"
                        >
                          <div className="p-3 d-flex align-items-center gap-2">
                            <img
                              src={
                                item.product.image ||
                                item.product.imageUrl ||
                                'https://via.placeholder.com/50x50?text=Product'
                              }
                              alt={item.product.name}
                              className="rounded"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                              }}
                            />
                            <div className="flex-grow-1" style={{ minWidth: '0' }}>
                              <h6 className="mb-1 text-truncate">{item.product.name}</h6>
                              <p
                                className="mb-0 text-success fw-bold"
                                style={{ fontSize: '0.9rem' }}
                              >
                                ${item.product.price} × {item.quantity}
                              </p>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        </li>
                      ))}

                      <li key="cart-totals" className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                          <strong>{t('cartPage.subtotal')}:</strong>
                          <span className="text-success fw-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex gap-2">
                          <Link className="btn btn-sm btn-primary flex-fill" to="/cart">
                            {t('cartPage.title')}
                          </Link>
                          <Link className="btn btn-sm btn-success flex-fill" to="/checkout">
                            {t('checkoutPage.title')}
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
      </nav>
    </header>
  );
};

export default Header;
