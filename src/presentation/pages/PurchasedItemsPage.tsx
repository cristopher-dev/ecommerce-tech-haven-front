import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/application/store/hooks";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PurchasedItemsPage: React.FC = () => {
  const { t } = useTranslation();
  const purchasedItems = useAppSelector((state) => state.purchasedItems.items);

  const groupedByTransaction = purchasedItems.reduce(
    (acc, item) => {
      if (!acc[item.transactionId]) {
        acc[item.transactionId] = [];
      }
      acc[item.transactionId].push(item);
      return acc;
    },
    {} as Record<string, typeof purchasedItems>,
  );

  const transactions = Object.entries(groupedByTransaction).map(
    ([transactionId, items]) => ({
      transactionId,
      items,
      purchaseDate: new Date(items[0].purchaseDate),
      total: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    }),
  );

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

        {purchasedItems.length === 0 ? (
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
