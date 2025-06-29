import type { UserProfile } from './user';

export interface AuthResponse {
  user: UserProfile;
  token: string;
}
