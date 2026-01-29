import { CartRepository } from "../../domain/ports/CartRepository";

export class UpdateCartItemQuantityUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(productId: number, quantity: number): void {
    this.cartRepository.updateItemQuantity(productId, quantity);
  }
}
