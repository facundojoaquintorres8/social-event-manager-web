export interface AuthRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
}
