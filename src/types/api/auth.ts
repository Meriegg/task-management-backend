import { User } from '../index';

export interface AuthBody {
  email: string;
  password: string;
}

export interface RefreshTokenReturnType {
  newRefreshToken: string;
  newAuthToken: string;
}

export interface AuthReturnType {
  user: User;
  authToken: string;
  refreshToken: string;
}

export interface GetUserDataReturnType {
  userData: User;
}
