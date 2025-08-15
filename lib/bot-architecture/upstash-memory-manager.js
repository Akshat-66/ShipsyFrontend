import { Redis } from "@upstash/redis"

export class UpstashMemoryManager {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }

  // Session Management
  async storeSession(userId, context) {
    const sessionKey = `session:${userId}`
    await this.redis.setex(sessionKey, 86400, JSON.stringify(context)) // 24 hours TTL
    return true
  }

  async getSession(userId) {
    const sessionKey = `session:${userId}`
    const session = await this.redis.get(sessionKey)
    return session ? JSON.parse(session) : null
  }

  async updateSession(userId, updates) {
    const current = (await this.getSession(userId)) || {}
    const updated = { ...current, ...updates, lastUpdated: Date.now() }
    await this.storeSession(userId, updated)
    return updated
  }

  // Conversation Context
  async addToContext(userId, message, role = "user") {
    const contextKey = `context:${userId}`
    const contextItem = {
      message,
      role,
      timestamp: Date.now(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    // Add to list and keep only last 20 messages
    await this.redis.lpush(contextKey, JSON.stringify(contextItem))
    await this.redis.ltrim(contextKey, 0, 19)
    await this.redis.expire(contextKey, 3600) // 1 hour TTL

    return contextItem
  }

  async getRecentContext(userId, limit = 10) {
    const contextKey = `context:${userId}`
    const messages = await this.redis.lrange(contextKey, 0, limit - 1)
    return messages.map((msg) => JSON.parse(msg)).reverse() // Chronological order
  }

  async clearContext(userId) {
    const contextKey = `context:${userId}`
    await this.redis.del(contextKey)
    return true
  }

  // User State Management
  async setUserState(userId, state) {
    const stateKey = `state:${userId}`
    await this.redis.setex(stateKey, 3600, JSON.stringify(state)) // 1 hour TTL
    return true
  }

  async getUserState(userId) {
    const stateKey = `state:${userId}`
    const state = await this.redis.get(stateKey)
    return state ? JSON.parse(state) : null
  }

  // Active Tasks Management
  async addActiveTask(userId, task) {
    const taskKey = `tasks:${userId}`
    const taskItem = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: "pending",
    }

    await this.redis.lpush(taskKey, JSON.stringify(taskItem))
    await this.redis.expire(taskKey, 86400) // 24 hours TTL

    return taskItem
  }

  async getActiveTasks(userId) {
    const taskKey = `tasks:${userId}`
    const tasks = await this.redis.lrange(taskKey, 0, -1)
    return tasks.map((task) => JSON.parse(task))
  }

  async updateTaskStatus(userId, taskId, status, result = null) {
    const tasks = await this.getActiveTasks(userId)
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status, result, updatedAt: Date.now() }
      }
      return task
    })

    const taskKey = `tasks:${userId}`
    await this.redis.del(taskKey)

    for (const task of updatedTasks) {
      await this.redis.lpush(taskKey, JSON.stringify(task))
    }

    await this.redis.expire(taskKey, 86400)
    return updatedTasks.find((task) => task.id === taskId)
  }

  // Feedback Patterns
  async storeFeedbackPattern(userId, pattern) {
    const patternKey = `patterns:${userId}`
    const patternItem = {
      ...pattern,
      timestamp: Date.now(),
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    await this.redis.lpush(patternKey, JSON.stringify(patternItem))
    await this.redis.ltrim(patternKey, 0, 49) // Keep last 50 patterns
    await this.redis.expire(patternKey, 604800) // 7 days TTL

    return patternItem
  }

  async getFeedbackPatterns(userId, limit = 10) {
    const patternKey = `patterns:${userId}`
    const patterns = await this.redis.lrange(patternKey, 0, limit - 1)
    return patterns.map((pattern) => JSON.parse(pattern))
  }

  // Analytics and Metrics
  async incrementMetric(metricName, value = 1) {
    const metricKey = `metrics:${metricName}`
    await this.redis.incrby(metricKey, value)
    await this.redis.expire(metricKey, 86400) // Reset daily
    return await this.redis.get(metricKey)
  }

  async getMetrics(metricNames) {
    const metrics = {}
    for (const name of metricNames) {
      const metricKey = `metrics:${name}`
      metrics[name] = (await this.redis.get(metricKey)) || 0
    }
    return metrics
  }

  // Cache Management
  async cacheResponse(key, response, ttl = 300) {
    const cacheKey = `cache:${key}`
    await this.redis.setex(cacheKey, ttl, JSON.stringify(response))
    return true
  }

  async getCachedResponse(key) {
    const cacheKey = `cache:${key}`
    const cached = await this.redis.get(cacheKey)
    return cached ? JSON.parse(cached) : null
  }

  // Cleanup utilities
  async cleanupExpiredData(userId) {
    const keys = [`session:${userId}`, `context:${userId}`, `state:${userId}`, `tasks:${userId}`, `patterns:${userId}`]

    let cleaned = 0
    for (const key of keys) {
      const exists = await this.redis.exists(key)
      if (!exists) cleaned++
    }

    return { cleaned, total: keys.length }
  }

  // Health check
  async healthCheck() {
    try {
      const testKey = `health:${Date.now()}`
      await this.redis.set(testKey, "ok")
      const result = await this.redis.get(testKey)
      await this.redis.del(testKey)

      return {
        status: result === "ok" ? "healthy" : "unhealthy",
        timestamp: Date.now(),
        latency: Date.now() - Number.parseInt(testKey.split(":")[1]),
      }
    } catch (error) {
      return {
        status: "error",
        error: error.message,
        timestamp: Date.now(),
      }
    }
  }
}

export default UpstashMemoryManager
