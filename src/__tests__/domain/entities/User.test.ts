import { User, UserProfile } from '@/domain/entities/User';

describe('User Entity', () => {
  it('should create a user profile with all properties', () => {
    const profile: UserProfile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'USER',
    };

    const user = new User(profile);

    expect(user.id).toBe('1');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('USER');
  });

  it('should return the full name', () => {
    const profile: UserProfile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const user = new User(profile);
    expect(user.getFullName()).toBe('John Doe');
  });

  it('should have all required properties', () => {
    const profile: UserProfile = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      role: 'ADMIN',
    };

    const user = new User(profile);
    const requiredProps = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'];
    for (const prop of requiredProps) {
      expect(user).toHaveProperty(prop);
    }
  });
});
