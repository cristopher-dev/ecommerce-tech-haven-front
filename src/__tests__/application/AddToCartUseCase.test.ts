import { AddToCartUseCase } from './AddToCartUseCase';
import { CartRepository } from '../../domain/ports/CartRepository';
import { CartItem } from '../../domain/entities/CartItem';

describe('AddToCartUseCase', () => {
  let mockCartRepository: jest.Mocked<CartRepository>;
  let useCase: AddToCartUseCase;

  beforeEach(() => {
    mockCartRepository = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
    };
    useCase = new AddToCartUseCase(mockCartRepository);
  });

  it('should call addItem on the repository with the provided item', () => {
    const item: CartItem = {
      product: {
        id: 1,
        name: 'Test Product',
        price: 10.99,
        image: 'test.jpg',
        discount: 0,
      },
      quantity: 1,
    };

    useCase.execute(item);

    expect(mockCartRepository.addItem).toHaveBeenCalledWith(item);
    expect(mockCartRepository.addItem).toHaveBeenCalledTimes(1);
  });
});