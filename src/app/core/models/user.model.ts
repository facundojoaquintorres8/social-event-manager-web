export interface User {
  firstName: string;
  lastName: string;
  email: string;
  hasPassword: boolean;
  premium: boolean;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hasPassword: boolean;
  premium: boolean;
}
