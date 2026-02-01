import { RemoveFromCartUseCase } from '@/application/useCases/RemoveFromCartUseCase';
import { CartRepository } from '../../domain/ports/CartRepository';

describe('RemoveFromCartUseCase', () => {
  let mockCartRepository: jest.Mocked<CartRepository>;
  let useCase: RemoveFromCartUseCase;

  beforeEach(() => {
    mockCartRepository = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
    };
    useCase = new RemoveFromCartUseCase(mockCartRepository);
  });

  it('should call removeItem on the repository with the productId', () => {
    const productId = 1;

    useCase.execute(productId);

    expect(mockCartRepository.removeItem).toHaveBeenCalledWith(productId);
    expect(mockCartRepository.removeItem).toHaveBeenCalledTimes(1);
  });
});