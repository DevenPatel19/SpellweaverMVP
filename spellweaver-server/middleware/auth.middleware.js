import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or malformed');
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Missing or malformed token' },
    });
  }

  const token = authHeader.slice(7); // remove "Bearer "
  console.log('Incoming token:', token);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT payload:', payload);

    // Attach minimal user info
    req.user = { id: payload.sub, role: payload.role };

    // Fetch full user document for extra checks
    const userDoc = await User.findById(payload.sub).select(
      '_id email role therapistId npiVerified'
    );

    if (!userDoc) {
      console.error('User not found for ID:', payload.sub);
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'User not found' },
      });
    }

    req.userDoc = userDoc;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' },
    });
  }
}
