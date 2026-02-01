import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export function authMiddleware() {
  return async (req, res, next) => {
    if (req.path === '/graphql') {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Токен отсутствует' });
      }

      const token = authHeader.replace('Bearer ', '');

      try {
        jwt.verify(token, SECRET_KEY);
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Невалидный токен' });
      }
    } else {
      next();
    }
  };
}