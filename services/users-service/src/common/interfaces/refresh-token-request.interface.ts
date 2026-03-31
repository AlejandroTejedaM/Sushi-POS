import { RefreshToken } from '../../users/entities/refresh-token.entity';

export interface RefreshTokenRequest extends Request {
  refreshToken: RefreshToken;
}
