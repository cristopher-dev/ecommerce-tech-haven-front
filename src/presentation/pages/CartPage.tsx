import { useAppDispatch, useCartItems } from '@/application/store/hooks';
import { removeFromCart, updateQuantity } from '@/application/store/slices/cartSlice';
import Footer from '@/presentation/components/Footer';
import Header from '@/presentation/components/Header';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, total } = useCartItems();
  const dispatch = useAppDispatch();

  const handleQuantityChange = (productId: string | number, quantity: number) => {
    const newQuantity = Number(quantity);
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    } else if (newQuantity === 0) {
      dispatch(removeFromCart(productId));
    }
  };

  return (
    <div>
      <Header />
      <main className="container my-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t('header.home')}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t('cartPage.title')}
            </li>
          </ol>
        </nav>
        <h1 className="mb-4">{t('cartPage.title')}</h1>
        {items.length === 0 ? (
          <p>{t('cartPage.emptyCart')}</p>
        ) : (
          <>
            {/* Desktop/TV View */}
            <div className="d-none d-lg-block">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="col-4">{t('cartPage.product')}</th>
                      <th className="col-2 text-center">{t('cartPage.image')}</th>
                      <th className="col-2 text-center">{t('cartPage.quantity')}</th>
                      <th className="col-1 text-end">{t('cartPage.price')}</th>
                      <th className="col-1 text-end">{t('common.total')}</th>
                      <th className="col-2 text-center">{t('common.remove')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={`${item.product.id}-${index}`}>
                        <td className="align-middle">{item.product.name}</td>
                        <td className="text-center align-middle">
                          <img
                            src={
                              item.product.imageUrl ||
                              'https://via.placeholder.com/60x60?text=No+Image'
                            }
                            alt={item.product.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        </td>
                        <td className="text-center align-middle">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product.id,
                                Number.parseInt(e.target.value, 10) || 0
                              )
                            }
                            min="1"
                            style={{ width: '70px', margin: '0 auto' }}
                          />
                        </td>
                        <td className="text-end align-middle">${item.product.price.toFixed(2)}</td>
                        <td className="text-end align-middle fw-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-center align-middle">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => dispatch(removeFromCart(item.product.id))}
                          >
                            {t('common.remove')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet View */}
            <div className="d-lg-none">
              <div className="row g-3">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="col">
                    <div className="card h-100 shadow-sm">
                      {/* Stack image on xs, side-by-side on sm+ */}
                      <div className="row g-0 h-100 flex-column flex-sm-row">
                        <div className="col-12 col-sm-5">
                          <img
                            src={
                              item.product.imageUrl ||
                              'https://via.placeholder.com/400x300?text=No+Image'
                            }
                            alt={item.product.name}
                            className="img-fluid w-100"
                            style={{ objectFit: 'cover', height: '180px' }}
                          />
                        </div>
                        <div className="col-12 col-sm-7 d-flex">
                          <div className="card-body p-2 p-sm-3 d-flex flex-column w-100">
                            <h6 className="card-title mb-2 text-truncate">{item.product.name}</h6>

                            <div className="mb-2">
                              <small className="text-muted">{t('cartPage.price')}:</small>
                              <p className="mb-1 fw-bold">${item.product.price.toFixed(2)}</p>
                            </div>

                            <div className="mb-2">
                              <small className="text-muted">{t('cartPage.quantity')}:</small>
                              <div className="input-group input-group-sm mt-1 justify-content-center">
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    handleQuantityChange(item.product.id, item.quantity - 1)
                                  }
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.product.id,
                                      Number.parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                  min="1"
                                  style={{ width: '70px' }}
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    handleQuantityChange(item.product.id, item.quantity + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="mb-2">
                              <small className="text-muted">{t('common.total')}:</small>
                              <p className="mb-2 fw-bold text-success fs-6">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>

                            <button
                              className="btn btn-danger btn-sm mt-auto w-100"
                              onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              {t('common.remove')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <div className="d-flex flex-column flex-md-row align-items-end justify-content-between gap-3">
                  <div>
                    <h4 className="mb-0">
                      {t('common.total')}: <span className="text-success">${total.toFixed(2)}</span>
                    </h4>
                  </div>
                  <Link to="/checkout/delivery" className="btn btn-success btn-lg w-100 w-md-auto">
                    {t('checkoutPage.title')}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
