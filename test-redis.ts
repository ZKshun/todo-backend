import { setJSON, getJSON, delKey } from './src/lib/redisClient';

async function testRedis() {
    try {
        // 测试设置数据
        await setJSON('user:123', { name: 'John', age: 30 }, 60);
        console.log('✅ Data set successfully');

        // 测试获取数据
        const user = await getJSON<{ name: string; age: number }>('user:123');
        console.log('✅ Data retrieved:', user);

        // 测试删除数据
        await delKey('user:123');
        console.log('✅ Data deleted successfully');

        // 验证删除
        const deletedUser = await getJSON('user:123');
        console.log('✅ After deletion:', deletedUser);

    } catch (error) {
        console.error('❌ Redis connection failed:', error);
    }
}

testRedis();