// Feedback Processing System

class FeedbackProcessor {
  constructor(memoryManager) {
    this.memoryManager = memoryManager
    this.categories = [
      "bug_report",
      "feature_request",
      "ui_feedback",
      "performance_issue",
      "content_suggestion",
      "praise",
      "general_inquiry",
    ]
  }

  async processFeedback(rawFeedback, userId, sessionId) {
    try {
      // Step 1: Classify and analyze feedback
      const analysis = await this.analyzeFeedback(rawFeedback)

      // Step 2: Create structured feedback object
      const feedback = {
        id: `fb_${Date.now()}_${userId}`,
        userId,
        sessionId,
        content: rawFeedback,
        timestamp: new Date().toISOString(),
        ...analysis,
      }

      // Step 3: Store in long-term memory with error handling
      const stored = await this.memoryManager.storeFeedback(feedback)
      if (!stored) {
        console.warn("Failed to store feedback, continuing with processing")
      }

      // Step 4: Determine immediate actions
      const actions = await this.determineActions(feedback)

      // Step 5: Update user context with error handling
      const updated = await this.updateUserProfile(userId, feedback)
      if (!updated) {
        console.warn("Failed to update user profile, continuing")
      }

      return {
        feedback,
        actions,
        response: await this.generateResponse(feedback, actions),
      }
    } catch (error) {
      console.error("Feedback processing error:", error)

      return {
        feedback: {
          id: `fb_error_${Date.now()}`,
          userId,
          sessionId,
          content: rawFeedback,
          category: "general_inquiry",
          sentiment: "neutral",
          priority: "low",
        },
        actions: [],
        response:
          "Thank you for your feedback. I've received your message and will make sure it's reviewed by our team.",
      }
    }
  }

  async analyzeFeedback(content) {
    // Sentiment analysis
    const sentiment = await this.analyzeSentiment(content)

    // Category classification
    const category = await this.classifyCategory(content)

    // Priority assessment
    const priority = await this.assessPriority(content, sentiment, category)

    // Extract actionable items
    const actionableItems = await this.extractActionableItems(content)

    return {
      sentiment,
      category,
      priority,
      actionableItems,
      confidence: this.calculateConfidence(sentiment, category, priority),
    }
  }

  async analyzeSentiment(content) {
    // Simple keyword-based sentiment analysis
    // In production, this would use Gemini or specialized sentiment API
    const positiveWords = ["good", "great", "excellent", "love", "amazing", "perfect", "helpful"]
    const negativeWords = ["bad", "terrible", "hate", "broken", "slow", "confusing", "frustrating"]

    const words = content.toLowerCase().split(/\s+/)
    let positiveScore = 0
    let negativeScore = 0

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveScore++
      if (negativeWords.includes(word)) negativeScore++
    })

    if (positiveScore > negativeScore) return "positive"
    if (negativeScore > positiveScore) return "negative"
    return "neutral"
  }

  async classifyCategory(content) {
    const categoryKeywords = {
      bug_report: ["bug", "error", "broken", "not working", "issue", "problem"],
      feature_request: ["add", "feature", "would like", "suggestion", "implement"],
      ui_feedback: ["design", "layout", "color", "button", "interface", "look"],
      performance_issue: ["slow", "loading", "performance", "speed", "lag"],
      content_suggestion: ["content", "text", "information", "copy", "wording"],
      praise: ["thank", "great", "excellent", "love", "amazing"],
      general_inquiry: ["how", "what", "when", "where", "help", "question"],
    }

    const contentLower = content.toLowerCase()
    let bestMatch = "general_inquiry"
    let maxScore = 0

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const score = keywords.reduce((count, keyword) => {
        return count + (contentLower.includes(keyword) ? 1 : 0)
      }, 0)

      if (score > maxScore) {
        maxScore = score
        bestMatch = category
      }
    })

    return bestMatch
  }

  async assessPriority(content, sentiment, category) {
    // Priority scoring based on multiple factors
    let score = 0

    // Sentiment impact
    if (sentiment === "negative") score += 2
    if (sentiment === "positive") score -= 1

    // Category impact
    const categoryPriority = {
      bug_report: 3,
      performance_issue: 3,
      feature_request: 1,
      ui_feedback: 1,
      content_suggestion: 1,
      praise: 0,
      general_inquiry: 0,
    }

    score += categoryPriority[category] || 0

    // Urgency keywords
    const urgentKeywords = ["urgent", "critical", "immediately", "asap", "broken"]
    if (urgentKeywords.some((keyword) => content.toLowerCase().includes(keyword))) {
      score += 2
    }

    // Convert score to priority level
    if (score >= 5) return "critical"
    if (score >= 3) return "high"
    if (score >= 1) return "medium"
    return "low"
  }

  async extractActionableItems(content) {
    // Extract specific actionable items from feedback
    const actionPatterns = [
      /please (add|implement|create|fix|change|update) (.+)/gi,
      /could you (add|implement|create|fix|change|update) (.+)/gi,
      /would like to (see|have|get) (.+)/gi,
      /suggestion: (.+)/gi,
    ]

    const actions = []
    actionPatterns.forEach((pattern) => {
      const matches = [...content.matchAll(pattern)]
      matches.forEach((match) => {
        actions.push({
          type: match[1] || "general",
          description: match[2] || match[1],
          confidence: 0.8,
        })
      })
    })

    return actions
  }

  calculateConfidence(sentiment, category, priority) {
    // Simple confidence calculation based on classification certainty
    let confidence = 0.5

    if (sentiment !== "neutral") confidence += 0.2
    if (category !== "general_inquiry") confidence += 0.2
    if (priority !== "low") confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  async determineActions(feedback) {
    const actions = []

    // Immediate response action
    actions.push({
      type: "respond",
      priority: "immediate",
      description: "Generate contextual response to user",
    })

    // Based on category and priority, determine follow-up actions
    if (feedback.category === "bug_report" && feedback.priority === "critical") {
      actions.push({
        type: "alert_team",
        priority: "immediate",
        description: "Alert development team about critical bug",
      })
    }

    if (feedback.category === "feature_request" && feedback.priority === "high") {
      actions.push({
        type: "create_ticket",
        priority: "high",
        description: "Create development ticket for feature request",
      })
    }

    if (feedback.actionableItems.length > 0) {
      actions.push({
        type: "plan_implementation",
        priority: "medium",
        description: "Plan implementation of suggested changes",
      })
    }

    return actions
  }

  async updateUserProfile(userId, feedback) {
    try {
      const currentContext = await this.memoryManager.getUserContext(userId)

      const updatedContext = {
        ...currentContext,
        last_feedback_category: feedback.category,
        last_feedback_sentiment: feedback.sentiment,
        feedback_count: (Number.parseInt(currentContext.feedback_count) || 0) + 1,
        last_interaction: feedback.timestamp,
        engagement_level: this.calculateEngagementLevel(currentContext, feedback),
      }

      return await this.memoryManager.updateUserContext(userId, updatedContext)
    } catch (error) {
      console.error("Failed to update user profile:", error)
      return false
    }
  }

  calculateEngagementLevel(currentContext, feedback) {
    const feedbackCount = Number.parseInt(currentContext.feedback_count) || 0
    const hasActionableItems = feedback.actionableItems.length > 0

    if (feedbackCount >= 5 && hasActionableItems) return "high"
    if (feedbackCount >= 2 || hasActionableItems) return "medium"
    return "low"
  }

  async generateResponse(feedback, actions) {
    // Generate contextual response based on feedback analysis
    const responseTemplates = {
      bug_report: {
        critical:
          "I understand you've encountered a critical issue. I've immediately flagged this for our development team and will ensure it gets priority attention. Can you provide any additional details about when this occurs?",
        high: "Thank you for reporting this bug. I've logged the issue and our team will investigate. In the meantime, is there a workaround I can suggest?",
        medium:
          "I've noted this issue in our system. We'll look into it during our next development cycle. Thanks for helping us improve!",
        low: "Thanks for the feedback. I've recorded this minor issue for future consideration.",
      },
      feature_request: {
        high: "That's an excellent suggestion! I can see how this feature would be valuable. I've added it to our development roadmap with high priority.",
        medium:
          "Great idea! I've logged this feature request for our team to evaluate. We'll consider it for future updates.",
        low: "Thanks for the suggestion. I've noted it for potential future enhancements.",
      },
      praise: {
        any: "Thank you so much for the positive feedback! It really motivates our team. Is there anything specific you'd like to see improved or added?",
      },
      ui_feedback: {
        any: "I appreciate your design feedback. Visual improvements are important to us. I've noted your suggestions for our design team to review.",
      },
    }

    const template =
      responseTemplates[feedback.category]?.[feedback.priority] ||
      responseTemplates[feedback.category]?.any ||
      "Thank you for your feedback. I've recorded your input and our team will review it."

    return template
  }
}

export default FeedbackProcessor
