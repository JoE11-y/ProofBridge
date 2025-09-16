import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), './.env'),
});

export const env = {
  db: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mysecret',
    expiry: process.env.JWT_EXPIRY || '7d',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
  },
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 9090,
  appDomain: process.env.SIGN_DOMAIN || 'proofbridge.xyz',
  appUri: process.env.SIGN_URI || 'https://proofbridge.xyz',
};
