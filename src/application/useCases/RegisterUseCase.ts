import { UserProfile } from "@/domain/entities/User";
import { RegisterRequest } from "@/shared/types/auth";

export interface IAuthRepository {
  register(
    request: RegisterRequest,
  ): Promise<{ user: UserProfile; token: string }>;
  login(
    email: string,
    password: string,
  ): Promise<{ user: UserProfile; token: string }>;
}

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(request: RegisterRequest): Promise<User> {
    if (!request.email?.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (!request.firstName || !request.lastName) {
      throw new Error("First name and last name are required");
    }
    if (request.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (request.password !== request.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const { user: userProfile } = await this.authRepository.register(request);
    return userProfile;
  }
}
