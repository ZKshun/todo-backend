// src/utils/errors.ts

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function createError(status: number, message: string) {
  return new AppError(status, message);
}

  
// const err = new Error('xxx');
// err.status = 400;
// throw err;
// 以后不用手动创建错误对象了，直接 throw createError(400, 'xxx');
// const { createError } = require('../utils/errors');
// throw createError(400, 'xxx');

