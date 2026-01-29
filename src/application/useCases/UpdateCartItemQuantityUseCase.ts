import { CartRepository } from "../../domain/ports/CartRepository";

export class UpdateCartItemQuantityUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private cartRepository: CartRepository) {}

  execute(productId: number, quantity: number): void {
    this.cartRepository.updateItemQuantity(productId, quantity);
  }
}
