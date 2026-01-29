import { UpdateCartItemQuantityUseCase } from './UpdateCartItemQuantityUseCase';
import { CartRepository } from '../../domain/ports/CartRepository';

describe('UpdateCartItemQuantityUseCase', () => {
  let mockCartRepository: jest.Mocked<CartRepository>;
  let useCase: UpdateCartItemQuantityUseCase;

  beforeEach(() => {
    mockCartRepository = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
    };
    useCase = new UpdateCartItemQuantityUseCase(mockCartRepository);
  });

  it('should call updateItemQuantity on the repository with productId and quantity', () => {
    const productId = 1;
    const quantity = 5;

    useCase.execute(productId, quantity);

    expect(mockCartRepository.updateItemQuantity).toHaveBeenCalledWith(productId, quantity);
    expect(mockCartRepository.updateItemQuantity).toHaveBeenCalledTimes(1);
  });
});