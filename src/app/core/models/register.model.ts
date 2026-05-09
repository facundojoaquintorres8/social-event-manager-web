export interface RegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponseDTO {
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
}
