import { useAppDispatch, useWishlist } from '@/application/store/hooks';
import { addToCart } from '@/application/store/slices/checkoutSlice';
import { moveToCart, removeFromWishlist } from '@/application/store/slices/wishlistSlice';
import { Product } from '@/domain/entities/Product';
import Footer from '@/presentation/components/Footer';
import Header from '@/presentation/components/Header';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, count } = useWishlist();

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product: Product) => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );
    dispatch(moveToCart(product.id));
  };

  const handleBuyAll = () => {
    for (const item of items) {
      dispatch(
        addToCart({
          product: item.product,
          quantity: 1,
        })
      );
    }
    navigate('/checkout/delivery');
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t('header.home')}</Link>
            </li>
            <li className="breadcrumb-item active">{t('header.wishlist')}</li>
          </ol>
        </nav>

        <h1 className="mb-4">
          <i className="bi bi-heart-fill text-danger me-2"></i>
          {t('wishlistPage.title')}{' '}
          {count > 0 && <span className="badge bg-danger ms-2">{count}</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
            <h3 className="text-muted mb-3">{t('wishlistPage.emptyWishlist')}</h3>
            <p className="text-muted mb-4">{t('wishlistPage.addItemsMessage')}</p>
            <Link to="/product" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>
              {t('cartPage.continueShoping')}
            </Link>
          </div>
        ) : (
          <div className="row g-3 g-md-4 wishlist-container">
            {/* Desktop/Tablet: Table View */}
            <div className="col-12 col-lg-9 d-none d-md-block">
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th scope="col" className="col-4">
                        {t('wishlistPage.product')}
                      </th>
                      <th scope="col" className="col-2 text-end">
                        {t('wishlistPage.price')}
                      </th>
                      <th scope="col" className="col-2 text-center">
                        {t('wishlistPage.stock')}
                      </th>
                      <th scope="col" className="col-4 text-center">
                        {t('wishlistPage.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`wishlist-${item.product.id}`} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center gap-2 gap-md-3">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="rounded"
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-1 text-truncate">{item.product.name}</h6>
                              <small className="text-muted d-none d-sm-inline">
                                {new Date(item.addedAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className="text-center">
                          {item.product.discount > 0 ? (
                            <span className="badge bg-success fs-7">
                              {t('wishlistPage.inStock')}
                            </span>
                          ) : (
                            <span className="badge bg-danger fs-7">
                              {t('wishlistPage.outOfStock')}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-success me-1 me-md-2"
                            onClick={() => handleMoveToCart(item.product)}
                            title={t('wishlistPage.addToCart')}
                          >
                            <i className="bi bi-bag-plus me-1 d-none d-lg-inline"></i>
                            <span className="d-none d-lg-inline">{t('common.add')}</span>
                            <span className="d-lg-none">
                              <i className="bi bi-bag-plus"></i>
                            </span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveFromWishlist(Number(item.product.id))}
                            title="Remove from wishlist"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile: Card View */}
            <div className="col-12 d-md-none">
              <div className="row g-2 g-sm-3">
                {items.map((item) => (
                  <div key={`wishlist-card-${item.product.id}`} className="col-12">
                    <div className="card shadow-sm h-100">
                      <div className="card-body p-2 p-sm-3">
                        <div className="d-flex gap-2 mb-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="rounded"
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-truncate-2">{item.product.name}</h6>
                            <p className="text-success fw-bold mb-1">
                              ${item.product.price.toFixed(2)}
                            </p>
                            <small className="text-muted d-block">
                              {new Date(item.addedAt).toLocaleDateString()}
                            </small>
                            <div className="mt-2">
                              {item.product.discount > 0 ? (
                                <span className="badge bg-success">
                                  {t('wishlistPage.inStock')}
                                </span>
                              ) : (
                                <span className="badge bg-danger">
                                  {t('wishlistPage.outOfStock')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-success flex-grow-1"
                            onClick={() => handleMoveToCart(item.product)}
                            title={t('wishlistPage.addToCart')}
                          >
                            <i className="bi bi-bag-plus me-1"></i>
                            {t('common.add')}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveFromWishlist(Number(item.product.id))}
                            title="Remove from wishlist"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist Summary - Desktop/Tablet */}
            <div className="col-12 col-lg-3 d-none d-lg-block">
              <div className="card shadow-sm sticky-lg-top" style={{ top: '20px' }}>
                <div className="card-body p-3 p-lg-4">
                  <h5 className="card-title mb-3">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    {t('wishlistPage.summary')}
                  </h5>

                  <div className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">{t('wishlistPage.totalItems')}</small>
                      <strong>{count}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{t('wishlistPage.totalValue')}</small>
                      <strong className="text-success">
                        ${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <Link to="/product" className="btn btn-outline-primary w-100 mb-2">
                    <i className="bi bi-arrow-left me-1"></i>
                    {t('wishlistPage.continueShopping')}
                  </Link>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleBuyAll}
                    disabled={items.length === 0}
                  >
                    <i className="bi bi-credit-card me-1"></i>
                    {t('common.buy')}
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist Summary - Mobile */}
            <div className="col-12 d-lg-none">
              <div className="card shadow-sm">
                <div className="card-body p-2 p-sm-3">
                  <h5 className="card-title mb-3">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    {t('wishlistPage.summary')}
                  </h5>

                  <div className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">{t('wishlistPage.totalItems')}</small>
                      <strong>{count}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{t('wishlistPage.totalValue')}</small>
                      <strong className="text-success">
                        ${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <Link to="/product" className="btn btn-outline-primary w-100 mb-2">
                    <i className="bi bi-arrow-left me-1"></i>
                    {t('wishlistPage.continueShopping')}
                  </Link>
                  <button
                    className="btn btn-success w-100"
                    onClick={handleBuyAll}
                    disabled={items.length === 0}
                  >
                    <i className="bi bi-credit-card me-1"></i>
                    {t('common.buy')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;
