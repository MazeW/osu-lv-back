import basicAuth from 'express-basic-auth';
import { config } from '../config/config';

export const authMiddleware = basicAuth({
  users: config.auth.users,
  challenge: true
});