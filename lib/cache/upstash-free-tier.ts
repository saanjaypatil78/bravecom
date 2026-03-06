// Memory cache fallback for Upstash Redis
const cache = new Map<string, any>();

export async function cacheSet(key: string, value: any, ttlSecs: number = 2592000) {
    cache.set(key, { value, expires: Date.now() + ttlSecs * 1000 });
}

export async function cacheGet(key: string) {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
        cache.delete(key);
        return null;
    }
    return item.value;
}
