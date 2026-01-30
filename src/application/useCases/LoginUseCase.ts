import { User, UserProfile } from "@/domain/entities/User";

export interface IAuthRepository {
  register(request: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{ user: UserProfile; token: string }>;
  login(
    email: string,
    password: string,
  ): Promise<{ user: UserProfile; token: string }>;
}

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    // Validate inputs
    if (!email?.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (!password || password.length < 6) {
      throw new Error("Invalid email or password");
    }

    const { user: userProfile, token } = await this.authRepository.login(
      email,
      password,
    );
    return { user: new User(userProfile), token };
  }
}
