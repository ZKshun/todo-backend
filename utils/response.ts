import { Response } from 'express';

export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T | null;
}