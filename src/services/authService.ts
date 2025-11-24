// src/services/authService.ts
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { createError } from '../utils/errors';
import { generateAccessToken, generateRefreshToken } from './tokenService';

export async function register(username: string, password: string) {
  if (!username || !password) {
    throw createError(400, 'username 和 password 都是必填的');
  }

  const existing = await User.findOne({ username });
  if (existing) {
    throw createError(409, '用户名已被注册');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword
  });

  return {
    id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function login(username: string, password: string) {
  if (!username || !password) {
    throw createError(400, 'username 和 password 都是必填的');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw createError(401, '用户名或密码错误');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, '用户名或密码错误');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { accessToken, refreshToken };
}

export async function getProfile(userId: string) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw createError(404, '用户不存在');
  }

  return {
    id: user._id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt
  };
}
