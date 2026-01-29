import { useState } from "react";
import { Cart } from "../../domain/entities/Cart";
import { CartItem } from "../../domain/entities/CartItem";
import { Product } from "../../domain/entities/Product";
import { LocalStorageCartRepository } from "../adapters/LocalStorageCartRepository";
import { AddToCartUseCase } from "../../application/useCases/AddToCartUseCase";
import { GetCartUseCase } from "../../application/useCases/GetCartUseCase";
import { RemoveFromCartUseCase } from "../../application/useCases/RemoveFromCartUseCase";
import { UpdateCartItemQuantityUseCase } from "../../application/useCases/UpdateCartItemQuantityUseCase";

const cartRepository = new LocalStorageCartRepository();
const addToCartUseCase = new AddToCartUseCase(cartRepository);
const getCartUseCase = new GetCartUseCase(cartRepository);
const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository);
const updateQuantityUseCase = new UpdateCartItemQuantityUseCase(cartRepository);

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => getCartUseCase.execute());

  const refreshCart = () => {
    setCart(getCartUseCase.execute());
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const item: CartItem = { product, quantity };
    addToCartUseCase.execute(item);
    refreshCart();
  };

  const removeFromCart = (productId: number) => {
    removeFromCartUseCase.execute(productId);
    refreshCart();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    updateQuantityUseCase.execute(productId, quantity);
    refreshCart();
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  };
};
