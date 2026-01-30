export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: "ADMIN" | "CUSTOMER" | "USER";
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export class User implements UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: "ADMIN" | "CUSTOMER" | "USER";
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(profile: UserProfile) {
    this.id = profile.id;
    this.email = profile.email;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.role = profile.role;
    this.phone = profile.phone;
    this.address = profile.address;
    this.city = profile.city;
    this.state = profile.state;
    this.zipCode = profile.zipCode;
    this.country = profile.country;
    this.createdAt = profile.createdAt;
    this.updatedAt = profile.updatedAt;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
