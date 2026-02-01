import { useAppDispatch, useWishlist } from "@/application/store/hooks";
import { addToCart } from "@/application/store/slices/checkoutSlice";
import {
  moveToCart,
  removeFromWishlist,
} from "@/application/store/slices/wishlistSlice";
import { Product } from "@/domain/entities/Product";
import Footer from "@/presentation/components/Footer";
import Header from "@/presentation/components/Header";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, count } = useWishlist();

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product: Product) => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
      }),
    );
    dispatch(moveToCart(product.id));
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t("header.home")}</Link>
            </li>
            <li className="breadcrumb-item active">{t("header.wishlist")}</li>
          </ol>
        </nav>

        <h1 className="mb-4">
          <i className="bi bi-heart-fill text-danger me-2"></i>
          {t("wishlistPage.title")}{" "}
          {count > 0 && <span className="badge bg-danger ms-2">{count}</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
            <h3 className="text-muted mb-3">
              {t("wishlistPage.emptyWishlist")}
            </h3>
            <p className="text-muted mb-4">
              {t("wishlistPage.addItemsMessage")}
            </p>
            <Link to="/product" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>
              {t("cartPage.continueShoping")}
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-9">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">{t("wishlistPage.product")}</th>
                      <th scope="col" className="text-end">
                        {t("wishlistPage.price")}
                      </th>
                      <th scope="col" className="text-center">
                        {t("wishlistPage.stock")}
                      </th>
                      <th scope="col" className="text-end">
                        {t("wishlistPage.action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={`wishlist-${item.product.id}`}
                        className="border-bottom"
                      >
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="rounded"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{item.product.name}</h6>
                              <small className="text-muted">
                                Added on{" "}
                                {new Date(item.addedAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className="text-center">
                          {item.product.discount > 0 ? (
                            <span className="badge bg-success">
                              {t("wishlistPage.inStock")}
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              {t("wishlistPage.outOfStock")}
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleMoveToCart(item.product)}
                            title={t("wishlistPage.addToCart")}
                          >
                            <i className="bi bi-bag-plus me-1"></i>
                            {t("common.add")}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleRemoveFromWishlist(Number(item.product.id))
                            }
                            title="Remove from wishlist"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Wishlist Summary */}
            <div className="col-lg-3">
              <div
                className="card shadow-sm sticky-top"
                style={{ top: "20px" }}
              >
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <i className="bi bi-heart-fill text-danger me-2"></i>
                    {t("wishlistPage.summary")}
                  </h5>

                  <div className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">
                        {t("wishlistPage.totalItems")}
                      </small>
                      <strong>{count}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        {t("wishlistPage.totalValue")}
                      </small>
                      <strong className="text-success">
                        $
                        {items
                          .reduce(
                            (total, item) => total + item.product.price,
                            0,
                          )
                          .toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to="/product"
                    className="btn btn-outline-primary w-100 mb-2"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    {t("wishlistPage.continueShopping")}
                  </Link>
                  <Link to="/cart" className="btn btn-primary w-100">
                    <i className="bi bi-bag me-1"></i>
                    {t("wishlistPage.goToCart")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;
