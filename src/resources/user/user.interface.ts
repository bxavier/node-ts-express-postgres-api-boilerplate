export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for creating a user
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Define interface for updating a user
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
