import { Redis } from "@upstash/redis"

class MemoryManager {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    this.embeddingModel = "text-embedding-004" // Gemini embedding model
    this.pineconeAvailable = false // Track Pinecone availability
  }

  // Short-term memory operations (Upstash Redis)
  async storeConversationTurn(sessionId, message, response) {
    const turn = {
      timestamp: new Date().toISOString(),
      message,
      response,
      id: `turn_${Date.now()}`,
    }

    try {
      await this.redis.lpush(`conversation_history:${sessionId}`, JSON.stringify(turn))
      await this.redis.ltrim(`conversation_history:${sessionId}`, 0, 19)
      await this.redis.expire(`conversation_history:${sessionId}`, 86400)
      return true
    } catch (error) {
      console.error("Failed to store conversation turn:", error)
      return false
    }
  }

  async getConversationHistory(sessionId, limit = 10) {
    try {
      const history = await this.redis.lrange(`conversation_history:${sessionId}`, 0, limit - 1)
      return history.map((turn) => JSON.parse(turn)).reverse()
    } catch (error) {
      console.error("Failed to get conversation history:", error)
      return []
    }
  }

  async updateUserContext(userId, context) {
    try {
      await this.redis.hset(`user_context:${userId}`, context)
      await this.redis.expire(`user_context:${userId}`, 86400)
      return true
    } catch (error) {
      console.error("Failed to update user context:", error)
      return false
    }
  }

  async getUserContext(userId) {
    try {
      return await this.redis.hgetall(`user_context:${userId}`)
    } catch (error) {
      console.error("Failed to get user context:", error)
      return {}
    }
  }

  async storeFeedback(feedback) {
    try {
      // Store in Redis as fallback
      const feedbackKey = `feedback:${feedback.userId}:${feedback.id}`
      await this.redis.setex(feedbackKey, 604800, JSON.stringify(feedback)) // 7 days TTL

      // Add to user's feedback list
      await this.redis.lpush(`user_feedback:${feedback.userId}`, feedback.id)
      await this.redis.ltrim(`user_feedback:${feedback.userId}`, 0, 99) // Keep last 100
      await this.redis.expire(`user_feedback:${feedback.userId}`, 604800)

      const embedding = await this.generateEmbedding(feedback.content)
      if (embedding) {
        const embeddingKey = `embedding:${feedback.id}`
        await this.redis.setex(embeddingKey, 604800, JSON.stringify(embedding))
      }

      return true
    } catch (error) {
      console.error("Failed to store feedback:", error)
      return false
    }
  }

  async searchRelevantMemories(query, userId, topK = 5) {
    try {
      const userFeedbackIds = await this.redis.lrange(`user_feedback:${userId}`, 0, -1)
      const relevantMemories = []

      for (const feedbackId of userFeedbackIds.slice(0, topK)) {
        const feedbackKey = `feedback:${userId}:${feedbackId}`
        const feedbackData = await this.redis.get(feedbackKey)

        if (feedbackData) {
          const feedback = JSON.parse(feedbackData)
          // Simple keyword matching for relevance
          const relevanceScore = this.calculateRelevance(query, feedback.content)

          if (relevanceScore > 0.1) {
            relevantMemories.push({
              score: relevanceScore,
              content: feedback.content,
              category: feedback.category,
              timestamp: feedback.timestamp,
              priority: feedback.priority,
            })
          }
        }
      }

      return relevantMemories.sort((a, b) => b.score - a.score).slice(0, topK)
    } catch (error) {
      console.error("Failed to search relevant memories:", error)
      return []
    }
  }

  calculateRelevance(query, content) {
    const queryWords = query.toLowerCase().split(/\s+/)
    const contentWords = content.toLowerCase().split(/\s+/)

    let matches = 0
    queryWords.forEach((word) => {
      if (contentWords.includes(word)) matches++
    })

    return matches / Math.max(queryWords.length, 1)
  }

  async generateEmbedding(text) {
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "models/embedding-004",
              content: {
                parts: [{ text }],
              },
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          return data.embedding.values
        }
      } catch (error) {
        console.error("Gemini embedding failed:", error)
      }
    }

    // Fallback to simple hash-based embedding
    return this.generateFallbackEmbedding(text)
  }

  generateFallbackEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(384).fill(0)

    words.forEach((word, index) => {
      const hash = this.simpleHash(word)
      embedding[hash % 384] += 1
    })

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return magnitude > 0 ? embedding.map((val) => val / magnitude) : embedding
  }

  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // Context assembly for response generation
  async assembleContext(userId, sessionId, currentMessage) {
    try {
      const [recentHistory, userContext, relevantMemories] = await Promise.all([
        this.getConversationHistory(sessionId, 10),
        this.getUserContext(userId),
        this.searchRelevantMemories(currentMessage, userId, 3),
      ])

      return {
        recentHistory,
        userContext,
        relevantMemories,
        currentMessage,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Failed to assemble context:", error)
      return {
        recentHistory: [],
        userContext: {},
        relevantMemories: [],
        currentMessage,
        timestamp: new Date().toISOString(),
      }
    }
  }

  async healthCheck() {
    try {
      const testKey = `health_check:${Date.now()}`
      await this.redis.set(testKey, "ok")
      const result = await this.redis.get(testKey)
      await this.redis.del(testKey)

      return {
        status: result === "ok" ? "healthy" : "unhealthy",
        redis: "connected",
        pinecone: this.pineconeAvailable ? "connected" : "unavailable",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        status: "error",
        redis: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      }
    }
  }
}

export default MemoryManager
