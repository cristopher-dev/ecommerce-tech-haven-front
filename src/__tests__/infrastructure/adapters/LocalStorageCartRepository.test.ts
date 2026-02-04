import { LocalStorageCartRepository } from '@/infrastructure/adapters/LocalStorageCartRepository';
import { CartItem } from '@/domain/entities/CartItem';

describe('LocalStorageCartRepository', () => {
  let repository: LocalStorageCartRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageCartRepository();
  });

  it('should return empty cart if nothing stored', () => {
    const cart = repository.getCart();
    expect(cart.items).toEqual([]);
  });

  it('should save and get cart', () => {
    const item: CartItem = {
      id: '1',
      product: {
        id: 'p1',
        name: 'Product 1',
        price: 10,
        image: '',
        description: '',
        category: '',
        brand: '',
        rating: 0,
        stock: 10,
      },
      quantity: 2,
    };
    repository.addItem(item);
    const cart = repository.getCart();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].product.id).toBe('p1');
  });

  it('should update quantity if item already exists', () => {
    const item: CartItem = {
      id: '1',
      product: {
        id: 'p1',
        name: 'Product 1',
        price: 10,
        image: '',
        description: '',
        category: '',
        brand: '',
        rating: 0,
        stock: 10,
      },
      quantity: 2,
    };
    repository.addItem(item);
    repository.addItem(item);
    const cart = repository.getCart();
    expect(cart.items[0].quantity).toBe(4);
  });

  it('should remove item', () => {
    const item: CartItem = {
      id: '1',
      product: {
        id: 'p1' as any,
        name: 'Product 1',
        price: 10,
        image: '',
        description: '',
        category: '',
        brand: '',
        rating: 0,
        stock: 10,
      },
      quantity: 2,
    };
    repository.addItem(item);
    repository.removeItem('p1' as any);
    const cart = repository.getCart();
    expect(cart.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const item: CartItem = {
      id: '1',
      product: {
        id: 'p1' as any,
        name: 'Product 1',
        price: 10,
        image: '',
        description: '',
        category: '',
        brand: '',
        rating: 0,
        stock: 10,
      },
      quantity: 2,
    };
    repository.addItem(item);
    repository.updateItemQuantity('p1' as any, 5);
    const cart = repository.getCart();
    expect(cart.items[0].quantity).toBe(5);
  });

  it('should remove item if quantity updated to 0', () => {
    const item: CartItem = {
      id: '1',
      product: {
        id: 'p1' as any,
        name: 'Product 1',
        price: 10,
        image: '',
        description: '',
        category: '',
        brand: '',
        rating: 0,
        stock: 10,
      },
      quantity: 2,
    };
    repository.addItem(item);
    repository.updateItemQuantity('p1' as any, 0);
    const cart = repository.getCart();
    expect(cart.items).toHaveLength(0);
  });

  it('should handle ensureProductId when product is missing', () => {
    const cartData = {
      items: [
        { id: '1', quantity: 1 }, // Missing product
      ],
    };
    localStorage.setItem('techhaven_cart', JSON.stringify(cartData));

    // We expect a console.warn
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const cart = repository.getCart();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should extract productId from id string if product id is missing', () => {
    const cartData = {
      items: [
        {
          id: 'p123-index-timestamp',
          product: { name: 'Extracted' }, // Missing product.id
          quantity: 1,
        },
      ],
    };
    localStorage.setItem('techhaven_cart', JSON.stringify(cartData));

    const cart = repository.getCart();
    expect(cart.items[0].product.id).toBe('p123');
  });

  it('should handle non-numeric extracted ID', () => {
    const cartData = {
      items: [
        {
          id: 'abc-index-timestamp',
          product: { name: 'Alpha' }, // Missing product.id
          quantity: 1,
        },
      ],
    };
    localStorage.setItem('techhaven_cart', JSON.stringify(cartData));

    const cart = repository.getCart();
    expect(cart.items[0].product.id).toBe('abc');
  });

  it('should handle missing product ID and un-extractable ID', () => {
    const cartData = {
      items: [
        {
          id: '', // Empty ID
          product: { name: 'Unknown' }, // Missing product.id
          quantity: 1,
        },
      ],
    };
    localStorage.setItem('techhaven_cart', JSON.stringify(cartData));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const cart = repository.getCart();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should ensure item has internal ID if missing', () => {
    const cartData = {
      items: [
        {
          product: { id: 'p1', name: 'Prod 1' },
          quantity: 1,
          // id is missing
        },
      ],
    };
    localStorage.setItem('techhaven_cart', JSON.stringify(cartData));

    const cart = repository.getCart();
    expect(cart.items[0].id).toBeDefined();
    expect(cart.items[0].id).toContain('p1-0-');
  });
});
