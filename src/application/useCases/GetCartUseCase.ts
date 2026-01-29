import { CartRepository } from "../../domain/ports/CartRepository";
import { Cart } from "../../domain/entities/Cart";

export class GetCartUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private cartRepository: CartRepository) {}

  execute(): Cart {
    return this.cartRepository.getCart();
  }
}
