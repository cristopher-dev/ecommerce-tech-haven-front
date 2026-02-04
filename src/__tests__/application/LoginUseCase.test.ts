import { LoginUseCase, IAuthRepository } from "@/application/useCases/LoginUseCase";
import { UserProfile } from "@/domain/entities/User";

describe("LoginUseCase", () => {
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
    };
    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  it("should successfully login with valid credentials", async () => {
    const user: UserProfile = {
      id: "1",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    };
    const token = "jwt-token-123";

    mockAuthRepository.login.mockResolvedValue({ user, token });

    const result = await loginUseCase.execute("user@example.com", "password123");

    expect(result.user).toEqual(user);
    expect(result.token).toBe(token);
    expect(mockAuthRepository.login).toHaveBeenCalledWith("user@example.com", "password123");
  });

  it("should throw error for invalid email format", async () => {
    await expect(loginUseCase.execute("invalid-email", "password123")).rejects.toThrow(
      "Invalid email format",
    );
  });

  it("should throw error for empty email", async () => {
    await expect(loginUseCase.execute("", "password123")).rejects.toThrow(
      "Invalid email format",
    );
  });

  it("should throw error for password too short", async () => {
    await expect(loginUseCase.execute("user@example.com", "12345")).rejects.toThrow(
      "Invalid email or password",
    );
  });

  it("should throw error for empty password", async () => {
    await expect(loginUseCase.execute("user@example.com", "")).rejects.toThrow(
      "Invalid email or password",
    );
  });

  it("should propagate repository errors", async () => {
    mockAuthRepository.login.mockRejectedValue(new Error("Network error"));

    await expect(loginUseCase.execute("user@example.com", "password123")).rejects.toThrow(
      "Network error",
    );
  });
});
