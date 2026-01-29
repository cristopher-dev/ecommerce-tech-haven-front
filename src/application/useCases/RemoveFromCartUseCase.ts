import { CartRepository } from "../../domain/ports/CartRepository";

export class RemoveFromCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(productId: number): void {
    this.cartRepository.removeItem(productId);
  }
}
