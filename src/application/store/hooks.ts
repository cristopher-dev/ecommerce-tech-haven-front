import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/application/store/store";

/**
 * Hook personalizado para acceder al dispatch con tipos
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook personalizado para acceder al selector con tipos
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook para acceder al estado de productos
 */
export const useProductsState = () => useAppSelector((state) => state.products);

/**
 * Hook para acceder al estado de transacciones
 */
export const useTransactionsState = () =>
  useAppSelector((state) => state.transactions);

/**
 * Hook para acceder al estado de entregas
 */
export const useDeliveriesState = () =>
  useAppSelector((state) => state.deliveries);

/**
 * Hook para acceder al estado de checkout
 */
export const useCheckoutState = () => useAppSelector((state) => state.checkout);

/**
 * Hook para acceder al estado de wishlist
 */
export const useWishlistState = () => useAppSelector((state) => state.wishlist);

/**
 * Hook para acceder al carrito
 */
export const useCart = () => {
  const { cartItems } = useAppSelector((state) => state.checkout);
  return cartItems;
};

/**
 * Hook para acceder a la lista de deseos
 */
export const useWishlist = () => {
  const { items } = useAppSelector((state) => state.wishlist);
  return {
    items,
    count: items.length,
  };
};

/**
 * Hook para calcular el total del carrito
 */
export const useCartTotal = () => {
  const { cartItems, baseFee, deliveryFee } = useAppSelector(
    (state) => state.checkout,
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + baseFee + deliveryFee;

  return {
    subtotal,
    baseFee,
    deliveryFee,
    total,
  };
};
