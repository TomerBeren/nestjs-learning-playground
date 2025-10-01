export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublicUser extends Omit<User, 'password'> {}