export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: UserRole;
  receiveNews: boolean;
  twoFactorEnabled: boolean;
}

export type UserWithoutPassword = Omit<User, "password">;

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UsersResponse extends ApiResponse<User[]> { }
export interface UserResponse {
  success: boolean;
  data: UserWithoutPassword;
  message: string;
}
export interface AddressesResponse extends ApiResponse<Address[]> { }
export interface AddressResponse extends ApiResponse<Address> { }
