import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useWishlist } from "@/application/store/hooks";
import {
  removeFromWishlist,
  moveToCart,
} from "@/application/store/slices/wishlistSlice";
import { addToCart } from "@/application/store/slices/checkoutSlice";
import { Product } from "@/domain/entities/Product";
import Header from "@/presentation/components/Header";
import Footer from "@/presentation/components/Footer";

const WishlistPage: React.FC = () => {
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
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">Wishlist</li>
          </ol>
        </nav>

        <h1 className="mb-4">
          <i className="bi bi-heart-fill text-danger me-2"></i>
          My Wishlist{" "}
          {count > 0 && <span className="badge bg-danger ms-2">{count}</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
            <h3 className="text-muted mb-3">Your wishlist is empty</h3>
            <p className="text-muted mb-4">
              Add items to your wishlist to save them for later!
            </p>
            <Link to="/product" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-9">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col" className="text-end">
                        Price
                      </th>
                      <th scope="col" className="text-center">
                        Stock
                      </th>
                      <th scope="col" className="text-end">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.product.id} className="border-bottom">
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
                            <span className="badge bg-success">In Stock</span>
                          ) : (
                            <span className="badge bg-danger">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleMoveToCart(item.product)}
                            title="Add to cart"
                          >
                            <i className="bi bi-bag-plus me-1"></i>
                            Add to Cart
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleRemoveFromWishlist(item.product.id)
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
                    Wishlist Summary
                  </h5>

                  <div className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Total Items:</small>
                      <strong>{count}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Total Value:</small>
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
                    Continue Shopping
                  </Link>
                  <Link to="/cart" className="btn btn-primary w-100">
                    <i className="bi bi-bag me-1"></i>
                    Go to Cart
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
