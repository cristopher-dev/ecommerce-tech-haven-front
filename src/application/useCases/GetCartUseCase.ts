import { CartRepository } from "../../domain/ports/CartRepository";
import { Cart } from "../../domain/entities/Cart";

export class GetCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(): Cart {
    return this.cartRepository.getCart();
  }
}
