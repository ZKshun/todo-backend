import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err));

export async function setJSON(key: string, data: unknown, ttlSeconds: number) {
    const json = JSON.stringify(data);
    await redis.set(key, json, 'EX', ttlSeconds);
}

export async function getJSON<T>(key: string): Promise<T | null> {
    const val = await redis.get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
}

export async function delKey(key: string) {
    await redis.del(key);
}

export default redis;
