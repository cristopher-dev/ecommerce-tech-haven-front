import { CartRepository } from "../../domain/ports/CartRepository";
import { CartItem } from "../../domain/entities/CartItem";

export class AddToCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  execute(item: CartItem): void {
    this.cartRepository.addItem(item);
  }
}
