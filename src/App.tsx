import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./presentation/pages/HomePage";
import ProductPage from "./presentation/pages/ProductPage";
import CartPage from "./presentation/pages/CartPage";
import CheckoutDeliveryPage from "./presentation/pages/CheckoutDeliveryPage";
import CheckoutSummaryPage from "./presentation/pages/CheckoutSummaryPage";
import CheckoutFinalStatusPage from "./presentation/pages/CheckoutFinalStatusPage";
import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/delivery" element={<CheckoutDeliveryPage />} />
        <Route path="/checkout/summary" element={<CheckoutSummaryPage />} />
        <Route path="/checkout/final" element={<CheckoutFinalStatusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
