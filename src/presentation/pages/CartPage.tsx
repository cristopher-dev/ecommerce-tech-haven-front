import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/application/store/hooks";
import {
  removeFromCart,
  updateQuantity,
} from "@/application/store/slices/cartSlice";
import { useCartItems } from "@/application/store/hooks";
import Header from "@/presentation/components/Header";
import Footer from "@/presentation/components/Footer";

const CartPage: React.FC = () => {
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
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Cart
            </li>
          </ol>
        </nav>
        <h1 className="mb-4">Shopping Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.product.id}>
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
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-12 text-end">
                <h4>Total: ${total.toFixed(2)}</h4>
                <Link to="/checkout/delivery" className="btn btn-success">
                  Proceed to Checkout
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
