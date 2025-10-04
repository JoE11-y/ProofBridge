import 'express';

declare global {
  namespace Express {
    export interface Request {
      admin?: {
        sub: string;
        [key: string]: unknown;
      };
      user?: {
        sub: string;
        [key: string]: unknown;
      };
    }
  }
}
