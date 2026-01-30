import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/application/store/hooks";
import {
  setStep,
  setLoading,
  setError,
  setLastTransactionId,
  clearCart,
} from "@/application/store/slices/checkoutSlice";
import { updateProductStock } from "@/application/store/slices/productsSlice";
import { addToPurchasedItems } from "@/application/store/slices/purchasedItemsSlice";
import { clearCart as clearCartState } from "@/application/store/slices/cartSlice";
import { transactionsApi } from "@/infrastructure/api/techHavenApiClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutSummaryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkout = useAppSelector((state) => state.checkout);
  const cart = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use cart items from cartSlice, fallback to checkoutSlice
  const cartItems = cart.items.length > 0 ? cart.items : checkout.cartItems;

  // Calculate totals
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
      dispatch(setError("Missing payment or delivery information"));
      return;
    }

    try {
      setIsProcessing(true);
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Extract customer name and email from delivery data
      const firstName = String(checkout.deliveryData.firstName || "").trim();
      const lastName = String(checkout.deliveryData.lastName || "").trim();
      const customerName = `${firstName} ${lastName}`.trim();
      const customerEmail = String(checkout.deliveryData.email || "").trim();
      const customerAddress =
        `${String(checkout.deliveryData.address || "").trim()}, ${String(checkout.deliveryData.city || "").trim()}, ${String(checkout.deliveryData.state || "").trim()} ${String(checkout.deliveryData.postalCode || "").trim()}`
          .replace(/,\s*,/g, ",")
          .trim();

      // Validate customer data - strict validation matching backend requirements
      if (typeof customerName !== "string") {
        throw new Error("customerName must be a string");
      }
      if (customerName === "" || customerName.length < 2) {
        throw new Error("customerName should not be empty");
      }

      if (typeof customerEmail !== "string") {
        throw new Error("customerEmail must be an email");
      }
      if (customerEmail === "") {
        throw new Error("customerEmail should not be empty");
      }
      if (!customerEmail.includes("@")) {
        throw new Error("customerEmail must be an email");
      }

      if (typeof customerAddress !== "string") {
        throw new Error("customerAddress must be a string");
      }
      if (customerAddress === "" || customerAddress.length < 5) {
        throw new Error("customerAddress should not be empty");
      }

      // Create transactions for each product in the cart
      const transactionIds: string[] = [];

      for (const item of cartItems) {
        // Ensure productId is properly converted to string
        const productId = String(item.product.id || "").trim();

        // Validate productId - strict validation matching backend requirements
        if (typeof productId !== "string") {
          throw new Error("productId must be a string");
        }
        if (productId === "") {
          throw new Error("productId should not be empty");
        }

        // Validate quantity - strict validation matching backend requirements
        const quantity = item.quantity;

        if (typeof quantity !== "number") {
          throw new Error("quantity must be an integer number");
        }
        if (!Number.isInteger(quantity)) {
          throw new Error("quantity must be an integer number");
        }
        if (quantity < 1) {
          throw new Error("quantity must not be less than 1");
        }
        if (quantity > 10) {
          throw new Error("quantity must not be greater than 10");
        }

        const transactionPayload = {
          customerName: customerName,
          customerEmail: customerEmail,
          customerAddress: customerAddress,
          productId: productId,
          quantity: quantity,
          cardData: {
            cardNumber: checkout.paymentData.cardNumber.replace(/\s/g, ""),
            cardholderName: checkout.paymentData.cardholderName,
            expirationMonth: checkout.paymentData.expirationMonth,
            expirationYear: checkout.paymentData.expirationYear,
            cvv: "", // Never send CVV to backend
          },
        };

        // Log the payload for debugging - including validation status
        console.log("=== TRANSACTION PAYLOAD ===");
        console.log("customerName:", customerName);
        console.log("customerEmail:", customerEmail);
        console.log("customerAddress:", customerAddress);
        console.log("productId:", productId);
        console.log("quantity:", quantity);
        console.log(
          "Full Payload:",
          JSON.stringify(transactionPayload, null, 2),
        );
        console.log("=== END PAYLOAD ===");

        const transactionResponse =
          await transactionsApi.create(transactionPayload);

        transactionIds.push(transactionResponse.id);

        // Process payment for each transaction
        await transactionsApi.processPayment(transactionResponse.id, {
          status: "COMPLETED",
        });

        // Update product stock after successful transaction
        dispatch(
          updateProductStock({
            productId: String(item.product.id),
            quantity: item.quantity,
          }),
        );
      }

      // Success - save first transaction ID (main transaction) and navigate
      const firstTransactionId = transactionIds[0];
      const transactionData = await transactionsApi.getById(firstTransactionId);
      dispatch(setLastTransactionId(transactionData.transactionNumber));
      dispatch(setStep("status"));

      // Add items to purchased history
      dispatch(
        addToPurchasedItems({
          items: cartItems,
          transactionId: transactionData.transactionNumber,
        }),
      );

      // Clear cart from both checkout and cart slices
      dispatch(clearCart());
      dispatch(clearCartState());

      setTimeout(() => {
        setIsProcessing(false);
        dispatch(setLoading(false));
        navigate("/checkout/final");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";

      // Log full error details for debugging
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
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "66%" }}
              aria-valuenow={66}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              Step 2 of 3: Summary
            </div>
          </div>
        </div>

        {checkout.error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {checkout.error}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(setError(null))}
            />
          </div>
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

            <h3 className="mt-4">Delivery Information</h3>
            {checkout.deliveryData && (
              <div className="card">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Name:</strong> {checkout.deliveryData.firstName}{" "}
                    {checkout.deliveryData.lastName}
                  </p>
                  <p className="mb-1">
                    <strong>Address:</strong> {checkout.deliveryData.address}
                  </p>
                  <p className="mb-1">
                    <strong>City:</strong> {checkout.deliveryData.city},{" "}
                    {checkout.deliveryData.state}
                  </p>
                  <p className="mb-1">
                    <strong>ZIP:</strong> {checkout.deliveryData.postalCode}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {checkout.deliveryData.email}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {checkout.deliveryData.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <h3>Cost Breakdown</h3>
            <div className="card">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col">Subtotal:</div>
                  <div className="col text-end">${subtotal.toFixed(2)}</div>
                </div>
                <div className="row mb-2">
                  <div className="col">Base Fee:</div>
                  <div className="col text-end">${baseFee.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col">Delivery Fee:</div>
                  <div className="col text-end">${deliveryFee.toFixed(2)}</div>
                </div>
                <hr />
                <div className="row mb-3">
                  <div className="col fs-5 fw-bold">Total:</div>
                  <div className="col text-end fs-5 fw-bold text-primary">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <h5 className="mt-4 mb-3">Payment Information</h5>
                {checkout.paymentData && (
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Card:</strong> {checkout.paymentData.cardNumber}
                    </p>
                    <p className="mb-1">
                      <strong>Holder:</strong>{" "}
                      {checkout.paymentData.cardholderName}
                    </p>
                    <p className="mb-0">
                      <strong>Expires:</strong>{" "}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Processing Payment...
                      </>
                    ) : (
                      `Place Order (${total.toFixed(2)})`
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <Link
                    to="/checkout/delivery"
                    className="btn btn-outline-secondary w-100"
                  >
                    Back to Delivery
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
