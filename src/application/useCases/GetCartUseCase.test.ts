import { GetCartUseCase } from './GetCartUseCase';
import { CartRepository } from '../../domain/ports/CartRepository';
import { Cart } from '../../domain/entities/Cart';

describe('GetCartUseCase', () => {
  let mockCartRepository: jest.Mocked<CartRepository>;
  let useCase: GetCartUseCase;

  beforeEach(() => {
    mockCartRepository = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
    };
    useCase = new GetCartUseCase(mockCartRepository);
  });

  it('should return the cart from the repository', () => {
    const mockCart: Cart = { items: [] };
    mockCartRepository.getCart.mockReturnValue(mockCart);

    const result = useCase.execute();

    expect(mockCartRepository.getCart).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockCart);
  });
});