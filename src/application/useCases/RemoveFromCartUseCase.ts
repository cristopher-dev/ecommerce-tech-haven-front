import { CartRepository } from "../../domain/ports/CartRepository";

export class RemoveFromCartUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private cartRepository: CartRepository) {}

  execute(productId: number): void {
    this.cartRepository.removeItem(productId);
  }
}
