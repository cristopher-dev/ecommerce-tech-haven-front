import { UserProfile } from "@/domain/entities/User";

describe("User Entity", () => {
  it("should create a user profile with all properties", () => {
    const user: UserProfile = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      createdAt: new Date().toISOString(),
      role: "user",
      isActive: true,
    };

    expect(user.id).toBe("1");
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.role).toBe("user");
    expect(user.isActive).toBe(true);
  });

  it("should have all required properties", () => {
    const user: UserProfile = {
      id: "1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      role: "admin",
      isActive: true,
    };

    const requiredProps = ["id", "firstName", "lastName", "email", "createdAt", "role", "isActive"];
    requiredProps.forEach((prop) => {
      expect(user).toHaveProperty(prop);
    });
  });
});
