import { JwtAuthInterface } from './jwt-auth.interface';
import { Request } from 'express';

export interface AuthenticatedRequestInterface extends Request {
  user: JwtAuthInterface;
}
