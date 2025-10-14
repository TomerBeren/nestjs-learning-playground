/**
 * User domain model
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User creation request DTO
 */
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email?: string;
  isActive?: boolean;
}

/**
 * User update request DTO
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
}
