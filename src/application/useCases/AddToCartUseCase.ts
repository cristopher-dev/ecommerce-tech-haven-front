import { CartRepository } from "../../domain/ports/CartRepository";
import { CartItem } from "../../domain/entities/CartItem";

export class AddToCartUseCase {
  // eslint-disable-next-line no-unused-vars
  constructor(private cartRepository: CartRepository) {}

  execute(item: CartItem): void {
    this.cartRepository.addItem(item);
  }
}
