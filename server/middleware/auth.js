import jwt from 'jsonwebtoken';
import { getUsers, sanitizeUser } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pathmind-dev-secret-change-in-production';

export function signToken(user) {
  return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { email } = jwt.verify(header.slice(7), JWT_SECRET);
    const user = getUsers()[email];
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = sanitizeUser(user);
    req.userEmail = email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
