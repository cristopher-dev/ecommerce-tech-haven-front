import React from "react";
import { useCart } from "../../infrastructure/hooks/useCart";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-12">
              {cart.items.map((item) => (
                <div key={item.product.id} className="card mb-3">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-4">
                        <h5>{item.product.name}</h5>
                      </div>
                      <div className="col-md-2">
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
                        />
                      </div>
                      <div className="col-md-2">
                        ${item.product.price.toFixed(2)}
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-end">
              <h4>Total: ${getTotalPrice().toFixed(2)}</h4>
              <button className="btn btn-success">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
