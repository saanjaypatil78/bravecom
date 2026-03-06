# Upstash Redis MCP Server - Global Integration

## Overview

**Project:** BRAVEECOM_STITCH  
**Version:** 1.0.0  
**Status:** Active  
**Account ID:** `5a5b656c-e5f7-4912-84ed-2f904b82a607`

---

## Project Structure

```
lib/mcp/upstash_redis/
├── workspace.json    # Global configuration
├── client.py         # Upstash Redis MCP Client
└── README.md         # This file
```

---

## Quick Start

### 1. Initialize Global Client

```python
from lib.mcp.upstash_redis.client import get_upstash_redis, init_upstash_redis

# Initialize global client
status = init_upstash_redis()
print(status)

# Or get the client instance
client = get_upstash_redis()
```

### 2. Run Demo

```bash
python lib/mcp/upstash_redis/client.py
```

---

## Configuration

### Environment Variables

Add to `.env`:

```env
# Upstash Redis
UPSTASH_REDIS_ACCOUNT_ID=5a5b656c-e5f7-4912-84ed-2f904b82a607
UPSTASH_REDIS_REST_TOKEN=your-rest-token-here
UPSTASH_REDIS_URL=https://5a5b656c-e5f7-4912-84ed-2f904b82a607.upstash.io
```

### Workspace Settings (`workspace.json`)

```json
{
  "version": "1.0.0",
  "project": "Upstash Redis MCP",
  "upstash": {
    "redis": {
      "account_id": "5a5b656c-e5f7-4912-84ed-2f904b82a607",
      "region": "global",
      "rest_api": true
    }
  },
  "global_settings": {
    "enabled": true,
    "persistent": true,
    "auto_connect": true,
    "connection_pooling": true
  }
}
```

---

## Features

### 1. Key-Value Storage
- `get(key)` - Get value
- `set(key, value, ttl)` - Set value with TTL
- `delete(key)` - Delete key
- `exists(key)` - Check if key exists
- `expire(key, seconds)` - Set expiration
- `ttl(key)` - Get time to live

### 2. Hash Operations
- `hget(key, field)` - Get hash field
- `hset(key, field, value)` - Set hash field
- `hdel(key, *fields)` - Delete hash fields
- `hgetall(key)` - Get all fields
- `hlen(key)` - Get hash length

### 3. List Operations
- `lpush(key, *values)` - Push to left
- `rpush(key, *values)` - Push to right
- `lrange(key, start, stop)` - Get range
- `lpop(key)` - Pop from left
- `rpop(key)` - Pop from right

### 4. Set Operations
- `sadd(key, *members)` - Add to set
- `smembers(key)` - Get all members
- `sismember(key, member)` - Check membership
- `srem(key, *members)` - Remove from set

### 5. Sorted Set Operations
- `zadd(key, mapping)` - Add with scores
- `zrange(key, start, stop)` - Get range
- `zscore(key, member)` - Get score

### 6. Rate Limiting
- `rate_limit(key, limit, window)` - Fixed window
- `sliding_window_limit(key, limit, window)` - Sliding window

### 7. Session Management
- `create_session(session_id, data, ttl)` - Create session
- `get_session(session_id)` - Get session
- `update_session(session_id, data)` - Update session
- `delete_session(session_id)` - Delete session

### 8. Cache Layer
- `cache_get(key)` - Get cached value
- `cache_set(key, value, ttl)` - Set cached value
- `cache_delete(key)` - Delete cache
- `cache_clear(pattern)` - Clear by pattern

### 9. Distributed Locking
- `acquire_lock(lock_name, ttl)` - Acquire lock
- `release_lock(lock_name, token)` - Release lock
- `extend_lock(lock_name, token, ttl)` - Extend lock

### 10. Counting
- `incr(key, amount)` - Increment counter
- `decr(key, amount)` - Decrement counter
- `get_counter(key)` - Get counter value
- `reset_counter(key)` - Reset counter

### 11. Pub/Sub
- `publish(channel, message)` - Publish message
- `subscribe(channel)` - Subscribe to channel

---

## Usage Examples

### Rate Limiting

```python
from lib.mcp.upstash_redis.client import get_upstash_redis

client = get_upstash_redis()

result = await client.rate_limit("api:login", limit=10, window=60)

if result["success"]:
    print(f"Allowed: {result['remaining']}/{result['limit']} remaining")
else:
    print("Rate limit exceeded")
```

### Session Management

```python
client = get_upstash_redis()

session_id = "user_123_session"
await client.create_session(
    session_id,
    {"user_id": 123, "email": "user@example.com"},
    ttl=86400
)

session = await client.get_session(session_id)
print(session)
```

### Cache Layer

```python
client = get_upstash_redis()

product_id = "prod_456"
cached = await client.cache_get(product_id)

if cached is None:
    product = await fetch_product_from_db(product_id)
    await client.cache_set(product_id, product, ttl=1800)
else:
    product = cached
```

### Distributed Locking

```python
client = get_upstash_redis()

lock_token = await client.acquire_lock("process_order_123", ttl=30)

if lock_token:
    try:
        await process_order("order_123")
    finally:
        await client.release_lock("process_order_123", lock_token)
else:
    print("Could not acquire lock, another process is running")
```

---

## Global Singleton

The client is available globally:

```python
from lib.mcp.upstash_redis.client import get_upstash_redis, init_upstash_redis

# Initialize once at startup
init_upstash_redis()

# Use anywhere in your application
client = get_upstash_redis()
result = await client.get("my_key")
```

---

## API Reference

### UpstashRedisClient

| Method | Description |
|--------|-------------|
| `connect()` | Initialize connection |
| `disconnect()` | Close connection |
| `get_status()` | Get client status |
| `keys(pattern)` | Get keys matching pattern |
| `flushdb()` | Flush database |
| `dbsize()` | Get database size |

---

## Acceptance Criteria

- [x] Global singleton client
- [x] Key-Value storage
- [x] Hash/List/Set operations
- [x] Rate limiting
- [x] Session management
- [x] Cache layer
- [x] Distributed locking
- [x] Atomic counting
- [x] Pub/Sub support

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Connection failures | Auto-reconnect with retries |
| Rate limits | Built-in rate limiting |
| Data loss | TTL for all cached data |
| Race conditions | Distributed locking |

---

*Last Updated: 2026-02-26*  
*Managed by: opencode*
