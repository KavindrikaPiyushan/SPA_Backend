import jwt from 'jsonwebtoken';

export const createAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

export const createRefreshToken = (user) =>
  jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );