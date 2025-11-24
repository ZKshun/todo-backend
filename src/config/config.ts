// src/config/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const port = Number(process.env.PORT || 3000);
export const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';
export const jwtSecret = process.env.JWT_SECRET || 'xv5ofh6fdnpt7gnyy02Z';

if (!mongoUri) {
  console.warn('⚠️ MONGO_URI 未配置');
}
if (!jwtSecret) {
  console.warn('⚠️ JWT_SECRET 未配置');
}
