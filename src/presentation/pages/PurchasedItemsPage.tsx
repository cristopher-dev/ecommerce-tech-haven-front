import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { fetchUserTransactions } from "@/application/store/slices/purchasedItemsSlice";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

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
        status: baseItem.status || "COMPLETED",
        total: 0,
      });
    }
    const txn = transactionsMap.get(item.transactionId)!;
    txn.items.push(item as unknown as PurchasedItemExtended);
    txn.total += item.product.price * item.quantity;
  }

  const transactions = Array.from(transactionsMap.values());

  const getStatusBadgeClass = (status: string): string => {
    if (status === "APPROVED") return "bg-success";
    if (status === "DECLINED") return "bg-danger";
    return "bg-warning";
  };

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row mb-4">
          <div className="col">
            <h1>{t("purchasedItemsPage.title")}</h1>
            <p className="text-muted">{t("purchasedItemsPage.description")}</p>
          </div>
        </div>

        {loading && (
          <div className="alert alert-info">
            <output className="spinner-border spinner-border-sm me-2">
              <span className="visually-hidden">{t("common.loading")}</span>
            </output>
            {t("purchasedItemsPage.loadingMessage")}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && purchasedItems.length === 0 ? (
          <div className="alert alert-info">
            <p>{t("purchasedItemsPage.emptyMessage")}</p>
            <Link to="/" className="btn btn-primary">
              {t("purchasedItemsPage.continueShoppingButton")}
            </Link>
          </div>
        ) : (
          <div className="row">
            {transactions.map((transaction) => (
              <div key={transaction.transactionId} className="col-md-12 mb-4">
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h6 className="mb-0">
                          {t("purchasedItemsPage.order")} #
                          {transaction.transactionId}
                        </h6>
                        <small className="text-muted">
                          {transaction.purchaseDate.toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </small>
                      </div>
                      <div className="col-md-6 text-end">
                        <h6 className="mb-0">
                          {t("purchasedItemsPage.total")}: $
                          {transaction.total.toFixed(2)}
                        </h6>
                        <span className={`badge ms-2 ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>{t("purchasedItemsPage.product")}</th>
                            <th className="text-center">
                              {t("purchasedItemsPage.quantity")}
                            </th>
                            <th className="text-end">
                              {t("purchasedItemsPage.unitPrice")}
                            </th>
                            <th className="text-end">
                              {t("purchasedItemsPage.subtotal")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaction.items.map((item) => (
                            <tr key={item.id || item.product.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.product.image && (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="img-thumbnail me-3"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  <div>
                                    <h6 className="mb-0">
                                      {item.product.name}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-end">
                                ${item.product.price.toFixed(2)}
                              </td>
                              <td className="text-end">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2,
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row mt-5">
          <div className="col text-center">
            <Link to="/" className="btn btn-outline-primary">
              {t("purchasedItemsPage.continueShoppingButton")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchasedItemsPage;
