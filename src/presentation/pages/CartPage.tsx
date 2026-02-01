import { useAppDispatch, useCartItems } from "@/application/store/hooks";
import {
  removeFromCart,
  updateQuantity,
} from "@/application/store/slices/cartSlice";
import Footer from "@/presentation/components/Footer";
import Header from "@/presentation/components/Header";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, total } = useCartItems();
  const dispatch = useAppDispatch();

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  return (
    <div>
      <Header />
      <main className="container my-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t("header.home")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("cartPage.title")}
            </li>
          </ol>
        </nav>
        <h1 className="mb-4">{t("cartPage.title")}</h1>
        {items.length === 0 ? (
          <p>{t("cartPage.emptyCart")}</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t("cartPage.product")}</th>
                    <th>{t("cartPage.image")}</th>
                    <th>{t("cartPage.quantity")}</th>
                    <th>{t("cartPage.price")}</th>
                    <th>{t("common.total")}</th>
                    <th>{t("common.remove")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={`${item.product.id}-${index}`}>
                      <td>{item.product.name}</td>
                      <td>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product.id,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          min="1"
                          style={{ width: "80px" }}
                        />
                      </td>
                      <td>${item.product.price.toFixed(2)}</td>
                      <td>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            dispatch(removeFromCart(item.product.id))
                          }
                        >
                          {t("common.remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-12 text-end">
                <h4>
                  {t("common.total")}: ${total.toFixed(2)}
                </h4>
                <Link to="/checkout/delivery" className="btn btn-success">
                  {t("checkoutPage.title")}
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
