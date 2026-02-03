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
    <div>
      <Header />
      <main className="container-fluid px-2 px-sm-3 px-md-4 py-2 py-sm-3 py-md-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3 mb-md-4">
          <ol className="breadcrumb breadcrumb-sm">
            <li className="breadcrumb-item">
              <Link to="/">{t('header.home')}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart">{t('header.cart')}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/checkout/delivery">{t('checkoutDelivery.breadcrumb')}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t('checkoutSummary.breadcrumb')}
            </li>
          </ol>
        </nav>

        {/* Progress Bar */}
        <div className="mb-3 mb-md-4">
          <div className="progress" style={{ height: '1.5rem' }}>
            <progress className="progress-bar" style={{ width: '66%' }} value={66} max={100}>
              {t('checkoutSummary.progressBar')}
            </progress>
          </div>
        </div>

        {/* Error Alert */}
        {checkout.error && (
          <output className="alert alert-danger alert-dismissible fade show fs-6 fs-md-5 mb-3 mb-md-4">
            {checkout.error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(setError(null))}
              aria-label="Close"
            />
          </output>
        )}

        {/* Title */}
        <h1 className="h3 h2-lg h1-xl mb-3 mb-md-4">{t('checkoutSummary.orderSummary')}</h1>

        {/* Main Content */}
        <div className="row g-2 g-md-3 g-lg-4">
          {/* Left Column - Items & Delivery */}
          <div className="col-12 col-lg-8 mb-3 mb-lg-0">
            {/* Items Section */}
            <section className="mb-4 mb-md-5">
              <h2 className="h4 h3-md h2-lg mb-3">{t('checkoutSummary.items')}</h2>

              {/* Desktop/Tablet Table View */}
              <div className="d-none d-md-block table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="fs-6 fw-bold">{t('checkoutSummary.product')}</th>
                      <th className="fs-6 fw-bold text-center">{t('checkoutSummary.quantity')}</th>
                      <th className="fs-6 fw-bold text-end">{t('checkoutSummary.price')}</th>
                      <th className="fs-6 fw-bold text-end">{t('common.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id || item.product.id}>
                        <td className="align-middle">{item.product.name}</td>
                        <td className="align-middle text-center">{item.quantity}</td>
                        <td className="align-middle text-end">${item.product.price.toFixed(2)}</td>
                        <td className="align-middle text-end fw-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="d-md-none">
                {cartItems.map((item) => (
                  <div key={item.id || item.product.id} className="card mb-2 mb-sm-3">
                    <div className="card-body p-2 p-sm-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0 fs-6 flex-grow-1">{item.product.name}</h5>
                        <span className="badge bg-primary fs-6">x{item.quantity}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted fs-7">
                          ${item.product.price.toFixed(2)} c/u
                        </span>
                        <span className="fw-bold fs-5">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Information Section */}
            <section className="mb-4 mb-md-5">
              <h2 className="h4 h3-md h2-lg mb-3">{t('checkoutSummary.deliveryInformation')}</h2>
              {checkout.deliveryData && (
                <div className="card">
                  <div className="card-body p-3 p-md-4">
                    <div className="row g-2 g-md-3">
                      <div className="col-12 col-sm-6">
                        <p className="mb-2 mb-md-3">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.name')}
                          </strong>
                          <span className="fs-6 fs-md-5">
                            {checkout.deliveryData.firstName} {checkout.deliveryData.lastName}
                          </span>
                        </p>
                      </div>
                      <div className="col-12 col-sm-6">
                        <p className="mb-2 mb-md-3">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.phone')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.phone}</span>
                        </p>
                      </div>
                      <div className="col-12">
                        <p className="mb-2 mb-md-3">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.email')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.email}</span>
                        </p>
                      </div>
                      <div className="col-12">
                        <p className="mb-2 mb-md-3">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.address')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.address}</span>
                        </p>
                      </div>
                      <div className="col-12 col-sm-6">
                        <p className="mb-0">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.city')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.city}</span>
                        </p>
                      </div>
                      <div className="col-12 col-sm-6">
                        <p className="mb-0">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.state')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.state}</span>
                        </p>
                      </div>
                      <div className="col-12 col-sm-6">
                        <p className="mb-0">
                          <strong className="d-block text-muted small text-uppercase mb-1">
                            {t('checkoutSummary.zip')}
                          </strong>
                          <span className="fs-6 fs-md-5">{checkout.deliveryData.postalCode}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Cost Breakdown & Payment */}
          <div className="col-12 col-lg-4">
            <div className="card sticky-top-responsive">
              <div className="card-body p-3 p-md-4">
                {/* Cost Breakdown */}
                <h2 className="h4 h3-md h2-lg mb-3">{t('checkoutSummary.costBreakdown')}</h2>

                <div className="mb-2 d-flex justify-content-between align-items-center pb-2">
                  <span className="text-muted">{t('checkoutSummary.subtotal')}:</span>
                  <span className="fw-500 fs-6 fs-md-5">${subtotal.toFixed(2)}</span>
                </div>

                <div className="mb-2 d-flex justify-content-between align-items-center pb-2">
                  <span className="text-muted">{t('checkoutSummary.baseFee')}:</span>
                  <span className="fw-500 fs-6 fs-md-5">${baseFee.toFixed(2)}</span>
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center pb-3 border-bottom">
                  <span className="text-muted">{t('checkoutSummary.deliveryFee')}:</span>
                  <span className="fw-500 fs-6 fs-md-5">${deliveryFee.toFixed(2)}</span>
                </div>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5 fs-lg-4">{t('checkoutSummary.total')}:</span>
                  <span className="fw-bold fs-4 fs-md-3 text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Payment Information */}
                <h3 className="h5 h4-md mb-3 pb-3 border-top">
                  {t('checkoutSummary.paymentInformation')}
                </h3>

                {checkout.paymentData && (
                  <div className="mb-4">
                    <div className="mb-2">
                      <p className="mb-1 text-muted small text-uppercase">
                        <strong>{t('checkoutSummary.card')}</strong>
                      </p>
                      <p className="mb-0 fs-6 fs-md-5">{checkout.paymentData.cardNumber}</p>
                    </div>
                    <div className="mb-2">
                      <p className="mb-1 text-muted small text-uppercase">
                        <strong>{t('checkoutSummary.holder')}</strong>
                      </p>
                      <p className="mb-0 fs-6 fs-md-5">{checkout.paymentData.cardholderName}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-muted small text-uppercase">
                        <strong>{t('checkoutSummary.expires')}</strong>
                      </p>
                      <p className="mb-0 fs-6 fs-md-5">
                        {checkout.paymentData.expirationMonth.toString().padStart(2, '0')}/
                        {checkout.paymentData.expirationYear.toString().slice(-2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 gap-md-3 mt-4">
                  <button
                    className="btn btn-primary btn-lg fs-6 fs-md-5 py-2 py-md-3"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || checkout.loading}
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        >
                          {t('checkoutSummary.processingPayment')}
                        </span>
                        <span>{t('checkoutSummary.processingPayment')}</span>
                      </>
                    ) : (
                      `${t('checkoutSummary.placeOrder')} (${total.toFixed(2)})`
                    )}
                  </button>

                  <Link
                    to="/checkout/delivery"
                    className="btn btn-outline-secondary fs-6 fs-md-5 py-2 py-md-3"
                  >
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
