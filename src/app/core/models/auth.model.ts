export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
  hasPassword: boolean;
  premium: boolean;
}
