import { useAppDispatch, useAppSelector } from '@/application/store/hooks';
import { clearCheckout } from '@/application/store/slices/checkoutSlice';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const CheckoutFinalStatusPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);
  const purchasedItems = useAppSelector((state) => state.purchasedItems.items);

  useEffect(() => {
    console.log('CheckoutFinalStatusPage mounted', {
      lastTransactionId: checkout.lastTransactionId,
      transactionItemsCount: checkout.transactionItems.length,
      purchasedItemsCount: purchasedItems.length,
      hasCartItems: (checkout.cartItems?.length || 0) > 0,
    });

    // If we DON'T have transaction data, we need to redirect
    // This catches cases where user directly navigated to this page
    if (!checkout.lastTransactionId && checkout.transactionItems.length === 0) {
      console.log('⚠️ No transaction data found, checking if this is a recovery scenario...');

      // Give redux-persist a moment to rehydrate from localStorage
      const timer = setTimeout(() => {
        // Check one more time after giving redux-persist time to sync
        if (!checkout.lastTransactionId) {
          console.log('❌ Still no transaction data after recovery window, redirecting to home');
          navigate('/');
        }
      }, 500);

      return () => clearTimeout(timer);
    }

    console.log('✅ CheckoutFinalStatusPage: Valid transaction data present');
  }, [checkout.lastTransactionId, checkout.transactionItems.length, navigate]);

  const handleReturnHome = () => {
    dispatch(clearCheckout());
    navigate('/');
  };

  // Use transactionItems if available, otherwise fall back to purchasedItems, otherwise fall back to checkout.cartItems
  let displayItems = checkout.cartItems || [];
  if (purchasedItems.length > 0) {
    displayItems = purchasedItems;
  }
  if (checkout.transactionItems.length > 0) {
    displayItems = checkout.transactionItems;
  }
  const subtotal = displayItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const baseFee = checkout.baseFee / 100;
  const deliveryFee = checkout.deliveryFee / 100;
  const total = subtotal + baseFee + deliveryFee;

  return (
    <div>
      <Header />
      <main className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-sm-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 col-xxl-5">
            {/* Success Card */}
            <div className="card border-success shadow-lg h-100">
              <div className="card-body text-center py-3 py-sm-4 py-md-5">
                <div className="mb-3 mb-sm-4">
                  <div
                    className="display-1 display-sm-2 text-success"
                    style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
                  >
                    <i className="bi bi-check-circle-fill">✓</i>
                  </div>
                </div>

                <h1
                  className="card-title text-success mb-2"
                  style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
                >
                  {t('checkoutFinal.orderConfirmed')}
                </h1>
                <p
                  className="card-text text-muted mb-4"
                  style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
                >
                  {t('checkoutFinal.thankYou')}
                </p>

                {/* Delivery Estimate */}
                <div
                  className="alert alert-success mb-4"
                  role="alert"
                  style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1rem)' }}
                >
                  <strong>{t('checkoutFinal.expectedDelivery')}</strong>
                  <br />
                  <small>{t('checkoutFinal.deliveryDays')}</small>
                </div>

                {/* Transaction Details */}
                <div
                  className="bg-light p-3 p-sm-4 rounded mb-4"
                  style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
                >
                  <div className="row mb-3">
                    <div className="col-6 col-sm-5 text-start">
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}
                      >
                        {t('checkoutFinal.transactionId')}
                      </small>
                    </div>
                    <div className="col-6 col-sm-7 text-end">
                      <strong
                        className="text-monospace d-block"
                        style={{
                          fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)',
                          wordBreak: 'break-all',
                        }}
                      >
                        {checkout.lastTransactionId}
                      </strong>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 col-sm-5 text-start">
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}
                      >
                        {t('checkoutFinal.orderDate')}
                      </small>
                    </div>
                    <div className="col-6 col-sm-7 text-end">
                      <strong style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}>
                        {new Date().toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row mb-3">
                    <div className="col-6 col-sm-5 text-start">
                      <small
                        className="text-muted"
                        style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}
                      >
                        {t('checkoutFinal.subtotal')}
                      </small>
                    </div>
                    <div
                      className="col-6 col-sm-7 text-end"
                      style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
                    >
                      ${subtotal.toFixed(2)}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 col-sm-5 text-start">
                      <small
                        className="text-muted"
                        style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)' }}
                      >
                        {t('checkoutFinal.fees')}
                      </small>
                    </div>
                    <div
                      className="col-6 col-sm-7 text-end"
                      style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
                    >
                      ${(baseFee + deliveryFee).toFixed(2)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 col-sm-5 text-start">
                      <strong style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
                        {t('checkoutFinal.totalPaid')}
                      </strong>
                    </div>
                    <div className="col-6 col-sm-7 text-end">
                      <strong
                        className="text-success"
                        style={{ fontSize: 'clamp(1rem, 2.2vw, 1.5rem)' }}
                      >
                        ${total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {displayItems.length > 0 && (
                  <div className="mb-4">
                    <h5
                      className="text-start mb-3"
                      style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
                    >
                      {t('checkoutFinal.orderItems')}
                    </h5>
                    <div className="list-group list-group-flush">
                      {displayItems.map((item) => (
                        <div
                          key={item.id || item.product.id}
                          className="list-group-item px-0 py-2 py-sm-3"
                        >
                          <div className="row align-items-center">
                            <div className="col-8 text-start">
                              <p
                                className="mb-1"
                                style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)' }}
                              >
                                {item.product.name}
                              </p>
                              <small
                                className="text-muted"
                                style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)' }}
                              >
                                {t('checkoutFinal.qty')} {item.quantity}
                              </small>
                            </div>
                            <div className="col-4 text-end">
                              <strong style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)' }}>
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                {checkout.deliveryData && (
                  <div className="mb-4">
                    <h5
                      className="text-start mb-3"
                      style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
                    >
                      {t('checkoutFinal.deliveryAddress')}
                    </h5>
                    <div
                      className="alert alert-info p-3 p-sm-4"
                      role="alert"
                      style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
                    >
                      <p className="mb-1">
                        <strong style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1rem)' }}>
                          {checkout.deliveryData.firstName} {checkout.deliveryData.lastName}
                        </strong>
                      </p>
                      <p className="mb-1">{checkout.deliveryData.address}</p>
                      <p className="mb-1">
                        {checkout.deliveryData.city}, {checkout.deliveryData.state}{' '}
                        {checkout.deliveryData.postalCode}
                      </p>
                      <p className="mb-0">
                        <small className="text-muted">
                          {t('checkoutFinal.phone')} {checkout.deliveryData.phone}
                        </small>
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 gap-sm-3 mt-4 mt-sm-5">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReturnHome}
                    style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', padding: '0.6rem 1rem' }}
                  >
                    {t('checkoutFinal.continueShopping')}
                  </button>
                  <Link
                    to="/"
                    className="btn btn-outline-secondary"
                    style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', padding: '0.6rem 1rem' }}
                  >
                    {t('common.back')}
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 mt-sm-5">
                  <progress value={100} max={100} className="w-100" style={{ height: '6px' }} />
                  <small
                    className="text-muted mt-2 d-block"
                    style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)' }}
                  >
                    {t('checkoutFinal.progressBar')}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutFinalStatusPage;
