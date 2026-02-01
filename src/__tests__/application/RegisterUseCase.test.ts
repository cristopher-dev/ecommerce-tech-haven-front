import { RegisterUseCase, IAuthRepository } from "@/application/useCases/RegisterUseCase";
import { User } from "@/domain/entities/User";

describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUseCase;
  const mockAuthRepository: IAuthRepository = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(() => {
    registerUseCase = new RegisterUseCase(mockAuthRepository);
    jest.clearAllMocks();
  });

  it("should register a user with valid data", async () => {
    const request = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      confirmPassword: "password123",
    };

    const mockUserProfile = {
      id: "1",
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockAuthRepository.register as jest.Mock).mockResolvedValue({
      user: mockUserProfile,
      token: "token123",
    });

    const result = await registerUseCase.execute(request);

    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe(request.email);
    expect(mockAuthRepository.register).toHaveBeenCalledWith(request);
  });

  it("should throw error for invalid email", async () => {
    const request = {
      email: "invalid-email",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      confirmPassword: "password123",
    };

    await expect(registerUseCase.execute(request)).rejects.toThrow(
      "Invalid email format",
    );
  });

  it("should throw error when passwords do not match", async () => {
    const request = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      confirmPassword: "password456",
    };

    await expect(registerUseCase.execute(request)).rejects.toThrow(
      "Passwords do not match",
    );
  });

  it("should throw error for short password", async () => {
    const request = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "pass",
      confirmPassword: "pass",
    };

    await expect(registerUseCase.execute(request)).rejects.toThrow(
      "Password must be at least 6 characters",
    );
  });

  it("should throw error when firstName is missing", async () => {
    const request = {
      email: "test@example.com",
      firstName: "",
      lastName: "Doe",
      password: "password123",
      confirmPassword: "password123",
    };

    await expect(registerUseCase.execute(request)).rejects.toThrow(
      "First name and last name are required",
    );
  });
});
