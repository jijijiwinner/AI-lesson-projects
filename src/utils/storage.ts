/**
 * 本地存储工具类
 */

const STORAGE_PREFIX = 'lesson_tracking_';

/**
 * 设置本地存储
 */
export function setStorage<T = any>(key: string, value: T): void {
  try {
    const data = JSON.stringify(value);
    uni.setStorageSync(STORAGE_PREFIX + key, data);
  } catch (error) {
    console.error('setStorage error:', error);
  }
}

/**
 * 获取本地存储
 */
export function getStorage<T = any>(key: string): T | null {
  try {
    const data = uni.getStorageSync(STORAGE_PREFIX + key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error('getStorage error:', error);
    return null;
  }
}

/**
 * 删除本地存储
 */
export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(STORAGE_PREFIX + key);
  } catch (error) {
    console.error('removeStorage error:', error);
  }
}

/**
 * 清空本地存储
 */
export function clearStorage(): void {
  try {
    uni.clearStorageSync();
  } catch (error) {
    console.error('clearStorage error:', error);
  }
}
