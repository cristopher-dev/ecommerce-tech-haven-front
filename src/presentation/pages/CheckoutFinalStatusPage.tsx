import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { clearCheckout } from "@/application/store/slices/checkoutSlice";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const CheckoutFinalStatusPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);
  const purchasedItems = useAppSelector((state) => state.purchasedItems.items);

  useEffect(() => {
    if (checkout.lastTransactionId) {
      console.log("CheckoutFinalStatusPage: Transaction successful", {
        transactionId: checkout.lastTransactionId,
        purchasedItemsCount: purchasedItems.length,
      });
    } else {
      console.warn(
        "CheckoutFinalStatusPage: No transaction ID found, redirecting to home",
      );
      navigate("/");
    }
  }, [checkout.lastTransactionId, purchasedItems.length, navigate]);

  const handleReturnHome = () => {
    dispatch(clearCheckout());
    navigate("/");
  };

  const subtotal = checkout.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const baseFee = checkout.baseFee / 100;
  const deliveryFee = checkout.deliveryFee / 100;
  const total = subtotal + baseFee + deliveryFee;

  return (
    <div>
      <Header />
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Success Card */}
            <div className="card border-success shadow-lg">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div className="display-1 text-success">
                    <i className="bi bi-check-circle-fill">✓</i>
                  </div>
                </div>

                <h1 className="card-title text-success mb-2">
                  {t("checkoutFinal.orderConfirmed")}
                </h1>
                <p className="card-text text-muted mb-4">
                  {t("checkoutFinal.thankYou")}
                </p>

                {/* Delivery Estimate */}
                <div className="alert alert-success mb-4" role="alert">
                  <strong>{t("checkoutFinal.expectedDelivery")}</strong>
                  <br />
                  <small>{t("checkoutFinal.deliveryDays")}</small>
                </div>

                {/* Transaction Details */}
                <div className="bg-light p-4 rounded mb-4">
                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">
                        {t("checkoutFinal.transactionId")}
                      </small>
                    </div>
                    <div className="col-6 text-end">
                      <strong className="text-monospace">
                        {checkout.lastTransactionId}
                      </strong>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">
                        {t("checkoutFinal.orderDate")}
                      </small>
                    </div>
                    <div className="col-6 text-end">
                      <strong>{new Date().toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">
                        {t("checkoutFinal.subtotal")}
                      </small>
                    </div>
                    <div className="col-6 text-end">${subtotal.toFixed(2)}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6 text-start">
                      <small className="text-muted">
                        {t("checkoutFinal.fees")}
                      </small>
                    </div>
                    <div className="col-6 text-end">
                      ${(baseFee + deliveryFee).toFixed(2)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 text-start">
                      <strong>{t("checkoutFinal.totalPaid")}</strong>
                    </div>
                    <div className="col-6 text-end">
                      <strong className="text-success fs-5">
                        ${total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {checkout.cartItems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-start mb-3">
                      {t("checkoutFinal.orderItems")}
                    </h5>
                    <div className="list-group list-group-flush">
                      {checkout.cartItems.map((item) => (
                        <div
                          key={item.id || item.product.id}
                          className="list-group-item px-0"
                        >
                          <div className="row align-items-center">
                            <div className="col-8 text-start">
                              <p className="mb-1">{item.product.name}</p>
                              <small className="text-muted">
                                {t("checkoutFinal.qty")} {item.quantity}
                              </small>
                            </div>
                            <div className="col-4 text-end">
                              <strong>
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2,
                                )}
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
                    <h5 className="text-start mb-3">
                      {t("checkoutFinal.deliveryAddress")}
                    </h5>
                    <div className="alert alert-info" role="alert">
                      <p className="mb-1">
                        <strong>
                          {checkout.deliveryData.firstName}{" "}
                          {checkout.deliveryData.lastName}
                        </strong>
                      </p>
                      <p className="mb-1">{checkout.deliveryData.address}</p>
                      <p className="mb-1">
                        {checkout.deliveryData.city},{" "}
                        {checkout.deliveryData.state}{" "}
                        {checkout.deliveryData.postalCode}
                      </p>
                      <p className="mb-0">
                        <small className="text-muted">
                          {t("checkoutFinal.phone")}{" "}
                          {checkout.deliveryData.phone}
                        </small>
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2 mt-5">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReturnHome}
                  >
                    {t("checkoutFinal.continueShopping")}
                  </button>
                  <Link to="/" className="btn btn-outline-secondary">
                    {t("common.back")}
                  </Link>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <progress
                    value={100}
                    max={100}
                    className="w-100"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted mt-2 d-block">
                    {t("checkoutFinal.progressBar")}
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
