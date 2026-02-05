import { useAppDispatch, useAppSelector } from '@/application/store/hooks';
import { clearCart as clearCartState } from '@/application/store/slices/cartSlice';
import {
  clearCart,
  clearPaymentSensitiveData,
  setError,
  setLastTransactionId,
  setLoading,
  setStep,
  setTransactionItems,
} from '@/application/store/slices/checkoutSlice';
import { updateProductStock } from '@/application/store/slices/productsSlice';
import { addToPurchasedItems } from '@/application/store/slices/purchasedItemsSlice';
import { transactionsApi } from '@/infrastructure/api/techHavenApiClient';
import '@/styles/pages/CheckoutSummaryPage.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const CheckoutSummaryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const checkout = useAppSelector((state) => state.checkout);
  const cart = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cart.items && cart.items.length > 0 ? cart.items : checkout.cartItems || [];

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const baseFee = checkout.baseFee / 100; // Convert cents to dollars
  const deliveryFee = checkout.deliveryFee / 100; // Convert cents to dollars
  const total = subtotal + baseFee + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!checkout.paymentData || !checkout.deliveryData || cartItems.length === 0) {
      console.log('Missing data for order:', {
        hasPaymentData: !!checkout.paymentData,
        hasDeliveryData: !!checkout.deliveryData,
        cartItemsCount: cartItems.length,
        cartItems: cartItems,
      });
      dispatch(setError('Missing payment or delivery information'));
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const firstName = String(checkout.deliveryData.firstName || '').trim();
      const lastName = String(checkout.deliveryData.lastName || '').trim();
      const customerName = `${firstName} ${lastName}`.trim();
      const customerEmail = String(checkout.deliveryData.email || '').trim();
      const customerAddress =
        `${String(checkout.deliveryData.address || '').trim()}, ${String(checkout.deliveryData.city || '').trim()}, ${String(checkout.deliveryData.state || '').trim()} ${String(checkout.deliveryData.postalCode || '').trim()}`
          .replaceAll(', ', ',')
          .trim();

      if (typeof customerName !== 'string') {
        throw new TypeError('customerName must be a string');
      }
      if (customerName === '' || customerName.length < 2) {
        throw new Error('customerName should not be empty');
      }

      if (typeof customerEmail !== 'string') {
        throw new TypeError('customerEmail must be an email');
      }
      if (customerEmail === '') {
        throw new Error('customerEmail should not be empty');
      }
      if (!customerEmail.includes('@')) {
        throw new Error('customerEmail must be an email');
      }

      if (typeof customerAddress !== 'string') {
        throw new TypeError('customerAddress must be a string');
      }
      if (customerAddress === '' || customerAddress.length < 5) {
        throw new Error('customerAddress should not be empty');
      }

      const items = cartItems.map((item) => {
        let productIdValue = item.product?.id;

        console.log('Transaction item processing:', {
          item_id: item.id,
          product: item.product,
          product_id: productIdValue,
          product_id_type: typeof productIdValue,
        });

        if (
          productIdValue === null ||
          productIdValue === undefined ||
          String(productIdValue).trim() === ''
        ) {
          if (item.id && typeof item.id === 'string') {
            const parts = item.id.split('-');
            productIdValue = parts[0]; // First part is usually the product ID
            console.warn('Extracted productId from cart item id:', productIdValue);
          }
        }

        if (
          productIdValue === null ||
          productIdValue === undefined ||
          String(productIdValue).trim() === ''
        ) {
          console.error('Cannot extract valid product ID from item:', {
            item,
            product_id: item.product?.id,
            item_id: item.id,
          });
          throw new Error('productId should not be empty');
        }

        const productId = String(productIdValue).trim();

        if (typeof productId !== 'string') {
          throw new TypeError('productId must be a string');
        }
        if (
          productId === '' ||
          productId === 'undefined' ||
          productId === 'null' ||
          productId === 'NaN'
        ) {
          throw new Error('productId should not be empty');
        }

        const quantity = item.quantity;

        if (typeof quantity !== 'number') {
          throw new TypeError('quantity must be an integer number');
        }
        if (!Number.isInteger(quantity)) {
          throw new TypeError('quantity must be an integer number');
        }
        if (quantity < 1) {
          throw new Error('quantity must not be less than 1');
        }
        if (quantity > 10) {
          throw new Error('quantity must not be greater than 10');
        }

        return { productId, quantity };
      });

      const deliveryInfo = {
        firstName: String(checkout.deliveryData.firstName || '').trim(),
        lastName: String(checkout.deliveryData.lastName || '').trim(),
        address: String(checkout.deliveryData.address || '').trim(),
        city: String(checkout.deliveryData.city || '').trim(),
        state: String(checkout.deliveryData.state || '').trim(),
        postalCode: String(checkout.deliveryData.postalCode || '').trim(),
        phone: String(checkout.deliveryData.phone || '').trim(),
      };

      const transactionPayload = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        items: items,
        deliveryInfo: deliveryInfo,
      };

      console.log('=== STEP 1: CREATE TRANSACTION ===');
      console.log('customerName:', customerName);
      console.log('customerEmail:', customerEmail);
      console.log('customerAddress:', customerAddress);
      console.log('items:', items);
      console.log('deliveryInfo:', deliveryInfo);
      console.log('Full Payload:', JSON.stringify(transactionPayload, null, 2));
      console.log('=== END STEP 1 PAYLOAD ===');

      const transactionResponse = await transactionsApi.create(transactionPayload);

      console.log('✅ Transaction created successfully:', {
        id: transactionResponse.id,
        transactionId: transactionResponse.transactionId,
        orderId: transactionResponse.orderId,
        status: transactionResponse.status,
      });

      const transactionIdForPayment = transactionResponse.id || transactionResponse.transactionId;

      if (!transactionIdForPayment) {
        throw new Error('No transaction ID received from backend');
      }

      const paymentPayload = {
        cardNumber: checkout.paymentData.cardNumber.replaceAll(' ', ''),
        cardholderName: checkout.paymentData.cardholderName,
        expirationMonth: checkout.paymentData.expirationMonth,
        expirationYear: checkout.paymentData.expirationYear,
        cvv: checkout.paymentData.cvv,
      };

      console.log('=== STEP 2: PROCESS PAYMENT ===');
      console.log('TransactionID (from Step 1):', transactionIdForPayment);
      console.log('Payment Data:', {
        ...paymentPayload,
        cardNumber: '****' + paymentPayload.cardNumber.slice(-4),
        cvv: '***',
      });
      console.log('=== END STEP 2 PAYLOAD ===');

      const paymentResponse = await transactionsApi.processPayment(
        transactionIdForPayment,
        paymentPayload
      );

      console.log('✅ Payment processed successfully:', {
        id: paymentResponse.id,
        status: paymentResponse.status,
        orderId: paymentResponse.orderId,
      });

      dispatch(clearPaymentSensitiveData());

      for (const item of cartItems) {
        dispatch(
          updateProductStock({
            productId: String(item.product.id),
            quantity: item.quantity,
          })
        );
      }

      dispatch(setLastTransactionId(paymentResponse.transactionId));
      dispatch(setStep('status'));

      dispatch(
        addToPurchasedItems({
          items: cartItems,
          transactionId: paymentResponse.transactionId,
        })
      );

      dispatch(setTransactionItems(cartItems));

      dispatch(clearCart());
      dispatch(clearCartState());

      // Manually persist the transaction ID and purchased items to localStorage
      // This ensures they're available immediately when the confirmation page loads
      try {
        const checkoutState = {
          lastTransactionId: JSON.stringify(paymentResponse.transactionId),
          cartItems: JSON.stringify(checkout.cartItems || cartItems),
          // Include other important checkout state
          _persist: { version: -1, rehydrated: true },
        };
        localStorage.setItem('persist:checkout', JSON.stringify(checkoutState));

        const purchasedItemsState = {
          items: JSON.stringify(cartItems),
          _persist: { version: -1, rehydrated: true },
        };
        localStorage.setItem('persist:purchasedItems', JSON.stringify(purchasedItemsState));

        console.log('✅ Transaction data manually persisted to localStorage:', {
          transactionId: paymentResponse.transactionId,
          itemsCount: cartItems.length,
        });
      } catch (storageError) {
        console.warn('Failed to persist to localStorage:', storageError);
      }

      // Now navigate immediately - the data is already in localStorage
      setIsProcessing(false);
      dispatch(setLoading(false));
      navigate('/checkout/final');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';

      console.error('Order processing error:', {
        error: err,
        message: errorMessage,
        checkoutData: {
          deliveryData: checkout.deliveryData,
          paymentData: checkout.paymentData,
          cartItems: cartItems,
        },
      });

      dispatch(setError(errorMessage));
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <main className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4">
          <div className="alert alert-warning fs-6 fs-md-5">
            {t('checkoutSummary.emptyCart')}.{' '}
            <Link to="/">{t('checkoutSummary.continueShopping')}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-summary-page">
      <Header />
      <main className="checkout-main container-fluid px-3 px-sm-4 px-md-5 py-4 py-md-5">
        {/* Enhanced Breadcrumb */}
        <nav aria-label="breadcrumb" className="breadcrumb-nav mb-4 mb-md-5">
          <ol className="breadcrumb breadcrumb-modern">
            <li className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">
                <span className="breadcrumb-icon">🏠</span>
                {t('header.home')}
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart" className="breadcrumb-link">
                <span className="breadcrumb-icon">🛒</span>
                {t('header.cart')}
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/checkout/delivery" className="breadcrumb-link">
                <span className="breadcrumb-icon">📦</span>
                {t('checkoutDelivery.breadcrumb')}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <span className="breadcrumb-current">
                <span className="breadcrumb-icon">📋</span>
                {t('checkoutSummary.breadcrumb')}
              </span>
            </li>
          </ol>
        </nav>

        {/* Enhanced Progress Bar */}
        <div className="progress-container mb-4 mb-md-5">
          <div className="progress-wrapper">
            <div className="progress-bar-modern" style={{ width: '66%' }}>
              <div className="progress-glow"></div>
            </div>
          </div>
          <div className="progress-steps">
            <span className="step completed" title="Carrito completado">
              <span className="step-icon">✓</span>
              <span className="step-label">Carrito</span>
            </span>
            <span className="step completed" title="Entrega completada">
              <span className="step-icon">✓</span>
              <span className="step-label">Entrega</span>
            </span>
            <span className="step active" title="Resumen del pedido">
              <span className="step-number">3</span>
              <span className="step-label">Resumen</span>
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {checkout.error && (
          <div className="error-alert alert-modern alert-error fade-in-up">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h4 className="alert-title">{t('common.error')}</h4>
              <p className="alert-message">{checkout.error}</p>
            </div>
            <button
              type="button"
              className="alert-close"
              onClick={() => dispatch(setError(null))}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Enhanced Title */}
        <header className="page-header mb-4 mb-md-5">
          <h1 className="page-title fade-in-up">
            <span className="title-icon">📋</span>
            {t('checkoutSummary.orderSummary')}
          </h1>
          <p className="page-subtitle">
            <span className="subtitle-icon">✨</span>
            Revisa los detalles de tu pedido antes de confirmar la compra
          </p>
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-line"></div>
          </div>
        </header>

        {/* Main Content */}
        <div className="checkout-grid">
          {/* Left Column - Items & Delivery */}
          <div className="checkout-content">
            {/* Enhanced Items Section */}
            <section className="order-items-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">🛍️</span>
                  {t('checkoutSummary.items')}
                </h2>
                <div className="section-meta">
                  <span className="item-count">
                    <span className="count-icon">📊</span>
                    {cartItems.length} artículo{cartItems.length !== 1 ? 's' : ''}
                  </span>
                  <div className="section-status">
                    <span className="status-dot"></span>
                    Listo para envío
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Table View */}
              <div className="items-table-container d-none d-md-block">
                <div className="modern-table">
                  <div className="table-header">
                    <div className="table-cell product-cell">{t('checkoutSummary.product')}</div>
                    <div className="table-cell qty-cell">{t('checkoutSummary.quantity')}</div>
                    <div className="table-cell price-cell">{t('checkoutSummary.price')}</div>
                    <div className="table-cell total-cell">{t('common.total')}</div>
                  </div>
                  <div className="table-body">
                    {cartItems.map((item, index) => (
                      <div key={item.id || item.product.id} className="table-row" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="table-cell product-cell">
                          <div className="product-info">
                            <h4 className="product-name">{item.product.name}</h4>
                            <span className="product-sku">SKU: {item.product.id}</span>
                          </div>
                        </div>
                        <div className="table-cell qty-cell">
                          <span className="quantity-badge">{item.quantity}</span>
                        </div>
                        <div className="table-cell price-cell">${item.product.price.toFixed(2)}</div>
                        <div className="table-cell total-cell total-price">${(item.product.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="items-mobile d-md-none">
                {cartItems.map((item, index) => (
                  <div key={item.id || item.product.id} className="item-card-modern fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="item-card-content">
                      <div className="item-header">
                        <h3 className="item-name">{item.product.name}</h3>
                        <span className="item-sku">SKU: {item.product.id}</span>
                      </div>
                      <div className="item-details">
                        <div className="detail-row">
                          <span className="detail-label">{t('checkoutSummary.quantity')}:</span>
                          <span className="quantity-display">{item.quantity}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">{t('checkoutSummary.price')}:</span>
                          <span className="price-display">${item.product.price.toFixed(2)}</span>
                        </div>
                        <div className="detail-row total-row">
                          <span className="detail-label">{t('common.total')}:</span>
                          <span className="total-display">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Enhanced Delivery Information Section */}
            <section className="delivery-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">🚚</span>
                  {t('checkoutSummary.deliveryInformation')}
                </h2>
                <div className="section-meta">
                  <div className="delivery-badge">
                    <span className="badge-icon">📍</span>
                    Envío estándar
                  </div>
                </div>
              </div>
              {checkout.deliveryData && (
                <div className="delivery-card-modern">
                  <div className="delivery-content">
                    <div className="delivery-row">
                      <div className="delivery-field">
                        <label className="field-label">{t('checkoutSummary.name')}</label>
                        <span className="field-value">{checkout.deliveryData.firstName} {checkout.deliveryData.lastName}</span>
                      </div>
                      <div className="delivery-field">
                        <label className="field-label">{t('checkoutSummary.phone')}</label>
                        <span className="field-value">{checkout.deliveryData.phone}</span>
                      </div>
                    </div>
                    <div className="delivery-row">
                      <div className="delivery-field full-width">
                        <label className="field-label">{t('checkoutSummary.email')}</label>
                        <span className="field-value">{checkout.deliveryData.email}</span>
                      </div>
                    </div>
                    <div className="delivery-row">
                      <div className="delivery-field full-width">
                        <label className="field-label">{t('checkoutSummary.address')}</label>
                        <span className="field-value">
                          {checkout.deliveryData.address}, {checkout.deliveryData.city}, {checkout.deliveryData.state} {checkout.deliveryData.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Cost Breakdown & Payment */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <div className="summary-header">
                <h2 className="summary-title">
                  <span className="summary-icon">💰</span>
                  {t('checkoutSummary.costBreakdown')}
                </h2>
                <div className="summary-subtitle">Resumen de costos</div>
              </div>

              <div className="summary-content">
                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <div className="cost-row">
                    <span className="cost-label">{t('checkoutSummary.subtotal')}</span>
                    <span className="cost-value">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">{t('checkoutSummary.baseFee')}</span>
                    <span className="cost-value">${baseFee.toFixed(2)}</span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">{t('checkoutSummary.deliveryFee')}</span>
                    <span className="cost-value">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="cost-divider"></div>
                  <div className="cost-row total-row">
                    <span className="cost-label total-label">{t('checkoutSummary.total')}</span>
                    <span className="cost-value total-value">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Enhanced Payment Information */}
                <div className="payment-section">
                  <h3 className="payment-title">
                    <span className="payment-icon">🔒</span>
                    {t('checkoutSummary.paymentInformation')}
                  </h3>
                  <div className="payment-security">
                    <span className="security-badge">
                      <span className="security-icon">🛡️</span>
                      Pago seguro SSL
                    </span>
                  </div>
                  {checkout.paymentData && (
                    <div className="payment-details">
                      <div className="payment-field">
                        <label className="payment-label">{t('checkoutSummary.card')}</label>
                        <span className="payment-value">•••• •••• •••• {checkout.paymentData.cardNumber.slice(-4)}</span>
                      </div>
                      <div className="payment-field">
                        <label className="payment-label">{t('checkoutSummary.holder')}</label>
                        <span className="payment-value">{checkout.paymentData.cardholderName}</span>
                      </div>
                      <div className="payment-field">
                        <label className="payment-label">{t('checkoutSummary.expires')}</label>
                        <span className="payment-value">
                          {checkout.paymentData.expirationMonth.toString().padStart(2, '0')}/{checkout.paymentData.expirationYear.toString().slice(-2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button
                    className="btn-primary-modern btn-place-order"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || checkout.loading}
                  >
                    {isProcessing ? (
                      <div className="loading-state">
                        <div className="spinner-modern"></div>
                        <span>{t('checkoutSummary.processingPayment')}</span>
                      </div>
                    ) : (
                      <div className="order-button-content">
                        <span className="button-text">{t('checkoutSummary.placeOrder')}</span>
                        <span className="button-amount">${total.toFixed(2)}</span>
                      </div>
                    )}
                  </button>

                  <Link to="/checkout/delivery" className="btn-secondary-modern">
                    {t('checkoutSummary.backToDelivery')}
                  </Link>
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

export default CheckoutSummaryPage;
