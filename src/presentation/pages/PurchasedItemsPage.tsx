import { useAppDispatch, useAppSelector } from '@/application/store/hooks';
import { fetchUserTransactions } from '@/application/store/slices/purchasedItemsSlice';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '@/styles/pages/PurchasedItemsPage.scss';

interface PurchasedItemExtended {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    stock?: number;
  };
  quantity: number;
  purchaseDate: string;
  transactionId: string;
  status?: string;
}

interface TransactionSummary {
  transactionId: string;
  items: PurchasedItemExtended[];
  purchaseDate: Date;
  status: string;
  total: number;
}

const PurchasedItemsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const purchasedItems = useAppSelector((state) => state.purchasedItems.items);
  const loading = useAppSelector((state) => state.purchasedItems.loading);
  const error = useAppSelector((state) => state.purchasedItems.error);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTransactions(user.id));
    }
  }, [user?.id, dispatch]);

  // Map purchasedItems to include transaction status and group by transaction
  const transactionsMap = new Map<string, TransactionSummary>();
  for (const item of purchasedItems) {
    if (!transactionsMap.has(item.transactionId)) {
      const baseItem = item as unknown as PurchasedItemExtended;
      transactionsMap.set(item.transactionId, {
        transactionId: item.transactionId,
        items: [],
        purchaseDate: new Date(item.purchaseDate),
        status: baseItem.status || 'COMPLETED',
        total: 0,
      });
    }
    const txn = transactionsMap.get(item.transactionId)!;
    txn.items.push(item as unknown as PurchasedItemExtended);
    txn.total += item.product.price * item.quantity;
  }

  const transactions = Array.from(transactionsMap.values());

  const getStatusBadgeClass = (status: string): string => {
    if (status === 'APPROVED') return 'bg-success';
    if (status === 'DECLINED') return 'bg-danger';
    return 'bg-warning';
  };

  const renderMobileCard = (transaction: TransactionSummary) => (
    <div key={transaction.transactionId} className="card mb-3 purchased-item-card-mobile">
      <div className="card-header bg-light py-2 py-sm-3">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <div className="flex-grow-1">
            <h6 className="mb-1 fs-6 fw-bold">
              {t('purchasedItemsPage.order')} #{transaction.transactionId}
            </h6>
            <small className="text-muted d-block">
              {transaction.purchaseDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </small>
          </div>
          <div className="text-end">
            <h6 className="mb-1 fs-6 fw-bold">${transaction.total.toFixed(2)}</h6>
            <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="d-flex flex-column gap-2">
          {transaction.items.map((item) => (
            <div key={item.id || item.product.id} className="d-flex gap-2 p-2 border-bottom">
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="rounded"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              )}
              <div className="flex-grow-1 min-width-0">
                <h6 className="mb-1 fs-7">{item.product.name}</h6>
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <small className="text-muted">
                    {t('purchasedItemsPage.quantity')}: {item.quantity}
                  </small>
                  <span className="fw-bold text-primary">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesktopTable = (transaction: TransactionSummary) => (
    <div key={transaction.transactionId} className="col-lg-12 mb-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light border-bottom py-3 py-lg-4">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-6">
              <h6 className="mb-1 fs-5 fw-bold">
                {t('purchasedItemsPage.order')} #{transaction.transactionId}
              </h6>
              <small className="text-muted">
                {transaction.purchaseDate.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </small>
            </div>
            <div className="col-12 col-lg-6 text-lg-end">
              <h6 className="mb-1 fs-5 fw-bold">
                {t('purchasedItemsPage.total')}: ${transaction.total.toFixed(2)}
              </h6>
              <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-2 px-lg-3">{t('purchasedItemsPage.product')}</th>
                  <th className="text-center px-2 px-lg-3">{t('purchasedItemsPage.quantity')}</th>
                  <th className="text-end px-2 px-lg-3">{t('purchasedItemsPage.unitPrice')}</th>
                  <th className="text-end px-2 px-lg-3">{t('purchasedItemsPage.subtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {transaction.items.map((item) => (
                  <tr key={item.id || item.product.id}>
                    <td className="px-2 px-lg-3">
                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="rounded"
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div className="min-width-0">
                          <h6 className="mb-0 text-truncate">{item.product.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-2 px-lg-3">{item.quantity}</td>
                    <td className="text-end px-2 px-lg-3">${item.product.price.toFixed(2)}</td>
                    <td className="text-end px-2 px-lg-3 fw-bold text-primary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <main className="container-fluid container-lg my-3 my-sm-4 my-lg-5">
        <section className="row mb-3 mb-sm-4 mb-lg-5">
          <div className="col-12">
            <h1 className="fs-1 fs-sm-2 fs-lg-1 fw-bold mb-2">{t('purchasedItemsPage.title')}</h1>
            <p className="text-muted fs-6 fs-sm-5 fs-lg-6 mb-0">
              {t('purchasedItemsPage.description')}
            </p>
          </div>
        </section>

        {loading && (
          <section className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-center gap-2" role="status">
                <div className="spinner-border spinner-border-sm flex-shrink-0" role="status">
                  <span className="visually-hidden">{t('common.loading')}</span>
                </div>
                <span>{t('purchasedItemsPage.loadingMessage')}</span>
              </div>
            </div>
          </section>
        )}

        {error && (
          <section className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <strong>{t('common.error')}:</strong> {error}
              </div>
            </div>
          </section>
        )}

        {!loading && purchasedItems.length === 0 ? (
          <section className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info" role="status">
                <p className="mb-3">{t('purchasedItemsPage.emptyMessage')}</p>
                <Link to="/" className="btn btn-primary btn-sm btn-md-normal">
                  {t('purchasedItemsPage.continueShoppingButton')}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="row g-2 g-sm-3 g-lg-4 mb-4 d-none d-lg-flex">
            {transactions.map((transaction) => renderDesktopTable(transaction))}
          </section>
        )}

        {!loading && purchasedItems.length > 0 && (
          <section className="row g-2 g-sm-3 d-flex d-lg-none">
            <div className="col-12">
              {transactions.map((transaction) => renderMobileCard(transaction))}
            </div>
          </section>
        )}

        <section className="row mt-4 mt-sm-5 mt-lg-6">
          <div className="col-12 text-center">
            <Link to="/" className="btn btn-outline-primary btn-sm btn-md-normal">
              {t('purchasedItemsPage.continueShoppingButton')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PurchasedItemsPage;
