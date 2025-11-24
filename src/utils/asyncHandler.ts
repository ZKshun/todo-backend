// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default function asyncHandler(fn: AsyncHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 使用方法如下
// import asyncHandler from '../utils/asyncHandler';

// const someHandler = asyncHandler(async (req, res) => {
//   // 出错直接 throw，交给 errorHandler
// });

  
