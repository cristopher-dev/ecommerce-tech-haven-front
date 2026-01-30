import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/application/store/store";
import HomePage from "@/presentation/pages/HomePage";
import ProductPage from "@/presentation/pages/ProductPage";
import CartPage from "@/presentation/pages/CartPage";
import WishlistPage from "@/presentation/pages/WishlistPage";
import CheckoutDeliveryPage from "@/presentation/pages/CheckoutDeliveryPage";
import CheckoutSummaryPage from "@/presentation/pages/CheckoutSummaryPage";
import CheckoutFinalStatusPage from "@/presentation/pages/CheckoutFinalStatusPage";
import RegisterPage from "@/presentation/pages/RegisterPage";
import LoginPage from "@/presentation/pages/LoginPage";
import "@/styles/App.scss";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route
              path="/checkout/delivery"
              element={<CheckoutDeliveryPage />}
            />
            <Route path="/checkout/summary" element={<CheckoutSummaryPage />} />
            <Route
              path="/checkout/final"
              element={<CheckoutFinalStatusPage />}
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
