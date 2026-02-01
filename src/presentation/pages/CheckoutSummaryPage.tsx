import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import { clearCart as clearCartState } from "@/application/store/slices/cartSlice";
import {
  clearCart,
  clearPaymentSensitiveData,
  setError,
  setLastTransactionId,
  setLoading,
  setStep,
  setTransactionItems,
} from "@/application/store/slices/checkoutSlice";
import { updateProductStock } from "@/application/store/slices/productsSlice";
import { addToPurchasedItems } from "@/application/store/slices/purchasedItemsSlice";
import { transactionsApi } from "@/infrastructure/api/techHavenApiClient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const CheckoutSummaryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const checkout = useAppSelector((state) => state.checkout);
  const cart = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems =
    cart.items && cart.items.length > 0 ? cart.items : checkout.cartItems || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const baseFee = checkout.baseFee / 100; // Convert cents to dollars
  const deliveryFee = checkout.deliveryFee / 100; // Convert cents to dollars
  const total = subtotal + baseFee + deliveryFee;

  const handlePlaceOrder = async () => {
    if (
      !checkout.paymentData ||
      !checkout.deliveryData ||
      cartItems.length === 0
    ) {
      console.log("Missing data for order:", {
        hasPaymentData: !!checkout.paymentData,
        hasDeliveryData: !!checkout.deliveryData,
        cartItemsCount: cartItems.length,
        cartItems: cartItems,
      });
      dispatch(setError("Missing payment or delivery information"));
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      const firstName = String(checkout.deliveryData.firstName || "").trim();
      const lastName = String(checkout.deliveryData.lastName || "").trim();
      const customerName = `${firstName} ${lastName}`.trim();
      const customerEmail = String(checkout.deliveryData.email || "").trim();
      const customerAddress =
        `${String(checkout.deliveryData.address || "").trim()}, ${String(checkout.deliveryData.city || "").trim()}, ${String(checkout.deliveryData.state || "").trim()} ${String(checkout.deliveryData.postalCode || "").trim()}`
          .replaceAll(", ", ",")
          .trim();

      if (typeof customerName !== "string") {
        throw new TypeError("customerName must be a string");
      }
      if (customerName === "" || customerName.length < 2) {
        throw new Error("customerName should not be empty");
      }

      if (typeof customerEmail !== "string") {
        throw new TypeError("customerEmail must be an email");
      }
      if (customerEmail === "") {
        throw new Error("customerEmail should not be empty");
      }
      if (!customerEmail.includes("@")) {
        throw new Error("customerEmail must be an email");
      }

      if (typeof customerAddress !== "string") {
        throw new TypeError("customerAddress must be a string");
      }
      if (customerAddress === "" || customerAddress.length < 5) {
        throw new Error("customerAddress should not be empty");
      }

      const items = cartItems.map((item) => {
        let productIdValue = item.product?.id;

        console.log("Transaction item processing:", {
          item_id: item.id,
          product: item.product,
          product_id: productIdValue,
          product_id_type: typeof productIdValue,
        });

        if (
          productIdValue === null ||
          productIdValue === undefined ||
          String(productIdValue).trim() === ""
        ) {
          if (item.id && typeof item.id === "string") {
            const parts = item.id.split("-");
            productIdValue = parts[0]; // First part is usually the product ID
            console.warn(
              "Extracted productId from cart item id:",
              productIdValue,
            );
          }
        }

        if (
          productIdValue === null ||
          productIdValue === undefined ||
          String(productIdValue).trim() === ""
        ) {
          console.error("Cannot extract valid product ID from item:", {
            item,
            product_id: item.product?.id,
            item_id: item.id,
          });
          throw new Error("productId should not be empty");
        }

        const productId = String(productIdValue).trim();

        if (typeof productId !== "string") {
          throw new TypeError("productId must be a string");
        }
        if (
          productId === "" ||
          productId === "undefined" ||
          productId === "null" ||
          productId === "NaN"
        ) {
          throw new Error("productId should not be empty");
        }

        const quantity = item.quantity;

        if (typeof quantity !== "number") {
          throw new TypeError("quantity must be an integer number");
        }
        if (!Number.isInteger(quantity)) {
          throw new TypeError("quantity must be an integer number");
        }
        if (quantity < 1) {
          throw new Error("quantity must not be less than 1");
        }
        if (quantity > 10) {
          throw new Error("quantity must not be greater than 10");
        }

        return { productId, quantity };
      });

      const deliveryInfo = {
        firstName: String(checkout.deliveryData.firstName || "").trim(),
        lastName: String(checkout.deliveryData.lastName || "").trim(),
        address: String(checkout.deliveryData.address || "").trim(),
        city: String(checkout.deliveryData.city || "").trim(),
        state: String(checkout.deliveryData.state || "").trim(),
        postalCode: String(checkout.deliveryData.postalCode || "").trim(),
        phone: String(checkout.deliveryData.phone || "").trim(),
      };

      const transactionPayload = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        items: items,
        deliveryInfo: deliveryInfo,
      };

      console.log("=== STEP 1: CREATE TRANSACTION ===");
      console.log("customerName:", customerName);
      console.log("customerEmail:", customerEmail);
      console.log("customerAddress:", customerAddress);
      console.log("items:", items);
      console.log("deliveryInfo:", deliveryInfo);
      console.log("Full Payload:", JSON.stringify(transactionPayload, null, 2));
      console.log("=== END STEP 1 PAYLOAD ===");

      const transactionResponse =
        await transactionsApi.create(transactionPayload);

      console.log("✅ Transaction created successfully:", {
        id: transactionResponse.id,
        transactionId: transactionResponse.transactionId,
        orderId: transactionResponse.orderId,
        status: transactionResponse.status,
      });

      const transactionIdForPayment =
        transactionResponse.id || transactionResponse.transactionId;

      if (!transactionIdForPayment) {
        throw new Error("No transaction ID received from backend");
      }

      const paymentPayload = {
        cardNumber: checkout.paymentData.cardNumber.replaceAll(" ", ""),
        cardholderName: checkout.paymentData.cardholderName,
        expirationMonth: checkout.paymentData.expirationMonth,
        expirationYear: checkout.paymentData.expirationYear,
        cvv: checkout.paymentData.cvv,
      };

      console.log("=== STEP 2: PROCESS PAYMENT ===");
      console.log("TransactionID (from Step 1):", transactionIdForPayment);
      console.log("Payment Data:", {
        ...paymentPayload,
        cardNumber: "****" + paymentPayload.cardNumber.slice(-4),
        cvv: "***",
      });
      console.log("=== END STEP 2 PAYLOAD ===");

      const paymentResponse = await transactionsApi.processPayment(
        transactionIdForPayment,
        paymentPayload,
      );

      console.log("✅ Payment processed successfully:", {
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
          }),
        );
      }

      dispatch(setLastTransactionId(paymentResponse.transactionId));
      dispatch(setStep("status"));

      dispatch(
        addToPurchasedItems({
          items: cartItems,
          transactionId: paymentResponse.transactionId,
        }),
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
        localStorage.setItem("persist:checkout", JSON.stringify(checkoutState));

        const purchasedItemsState = {
          items: JSON.stringify(cartItems),
          _persist: { version: -1, rehydrated: true },
        };
        localStorage.setItem(
          "persist:purchasedItems",
          JSON.stringify(purchasedItemsState),
        );

        console.log("✅ Transaction data manually persisted to localStorage:", {
          transactionId: paymentResponse.transactionId,
          itemsCount: cartItems.length,
        });
      } catch (storageError) {
        console.warn("Failed to persist to localStorage:", storageError);
      }

      // Now navigate immediately - the data is already in localStorage
      setIsProcessing(false);
      dispatch(setLoading(false));
      navigate("/checkout/final");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";

      console.error("Order processing error:", {
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
        <main className="container my-4">
          <div className="alert alert-warning">
            Your cart is empty. <Link to="/">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/cart">Cart</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/checkout/delivery">Delivery</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Summary
            </li>
          </ol>
        </nav>
        <div className="mb-4">
          <div className="progress">
            <progress
              className="progress-bar"
              style={{ width: "66%" }}
              value={66}
              max={100}
            >
              Step 2 of 3: Summary
            </progress>
          </div>
        </div>

        {checkout.error && (
          <output className="alert alert-danger alert-dismissible fade show">
            {checkout.error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(setError(null))}
            />
          </output>
        )}

        <h2>Order Summary</h2>
        <div className="row">
          <div className="col-md-8">
            <h3>Your Order</h3>
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id || item.product.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="mt-4">{t("checkoutSummary.deliveryInformation")}</h3>
            {checkout.deliveryData && (
              <div className="card">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>{t("checkoutSummary.name")}:</strong>{" "}
                    {checkout.deliveryData.firstName}{" "}
                    {checkout.deliveryData.lastName}
                  </p>
                  <p className="mb-1">
                    <strong>{t("checkoutSummary.address")}:</strong>{" "}
                    {checkout.deliveryData.address}
                  </p>
                  <p className="mb-1">
                    <strong>{t("checkoutSummary.city")}:</strong>{" "}
                    {checkout.deliveryData.city}, {checkout.deliveryData.state}
                  </p>
                  <p className="mb-1">
                    <strong>{t("checkoutSummary.zip")}:</strong>{" "}
                    {checkout.deliveryData.postalCode}
                  </p>
                  <p className="mb-1">
                    <strong>{t("checkoutSummary.email")}:</strong>{" "}
                    {checkout.deliveryData.email}
                  </p>
                  <p className="mb-0">
                    <strong>{t("checkoutSummary.phone")}:</strong>{" "}
                    {checkout.deliveryData.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <h3>{t("checkoutSummary.costBreakdown")}</h3>
            <div className="card">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col">{t("checkoutSummary.subtotal")}:</div>
                  <div className="col text-end">${subtotal.toFixed(2)}</div>
                </div>
                <div className="row mb-2">
                  <div className="col">{t("checkoutSummary.baseFee")}:</div>
                  <div className="col text-end">${baseFee.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col">{t("checkoutSummary.deliveryFee")}:</div>
                  <div className="col text-end">${deliveryFee.toFixed(2)}</div>
                </div>
                <hr />
                <div className="row mb-3">
                  <div className="col fs-5 fw-bold">
                    {t("checkoutSummary.total")}:
                  </div>
                  <div className="col text-end fs-5 fw-bold text-primary">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <h5 className="mt-4 mb-3">
                  {t("checkoutSummary.paymentInformation")}
                </h5>
                {checkout.paymentData && (
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>{t("checkoutSummary.card")}:</strong>{" "}
                      {checkout.paymentData.cardNumber}
                    </p>
                    <p className="mb-1">
                      <strong>{t("checkoutSummary.holder")}:</strong>{" "}
                      {checkout.paymentData.cardholderName}
                    </p>
                    <p className="mb-0">
                      <strong>{t("checkoutSummary.expires")}:</strong>{" "}
                      {checkout.paymentData.expirationMonth
                        .toString()
                        .padStart(2, "0")}
                      /
                      {checkout.paymentData.expirationYear.toString().slice(-2)}
                    </p>
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || checkout.loading}
                  >
                    {isProcessing ? (
                      <>
                        <output className="spinner-border spinner-border-sm me-2">
                          {t("checkoutSummary.processingPayment")}
                        </output>
                        <span>{t("checkoutSummary.processingPayment")}</span>
                      </>
                    ) : (
                      `${t("checkoutSummary.placeOrder")} (${total.toFixed(2)})`
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <Link
                    to="/checkout/delivery"
                    className="btn btn-outline-secondary w-100"
                  >
                    {t("checkoutSummary.backToDelivery")}
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
