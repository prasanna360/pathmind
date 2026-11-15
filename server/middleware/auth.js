import jwt from 'jsonwebtoken';
import { getUser, sanitizeUser } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'pathmind-dev-secret-change-in-production');

if (!JWT_SECRET) throw new Error('JWT_SECRET must be configured in production.');

export function signToken(user) {
  return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let email;
  try {
    ({ email } = jwt.verify(header.slice(7), JWT_SECRET));
    if (typeof email !== 'string' || !email) return res.status(401).json({ error: 'Invalid or expired token' });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const user = await getUser(email);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = sanitizeUser(user);
    req.userEmail = email;
    next();
  } catch (error) {
    next(error);
  }
}
