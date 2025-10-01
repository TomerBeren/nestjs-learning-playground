export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
}

export interface AuthPayload {
  username: string;
  sub: number;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}