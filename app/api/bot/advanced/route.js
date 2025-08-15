import { NextResponse } from "next/server"
import MemoryManager from "@/lib/bot-architecture/memory-manager"
import FeedbackProcessor from "@/lib/bot-architecture/feedback-processor"

const memoryManager = new MemoryManager()
const feedbackProcessor = new FeedbackProcessor(memoryManager)

export async function POST(request) {
  try {
    const { message, userId, sessionId, type = "chat" } = await request.json()

    if (!message || !userId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields: message, userId, sessionId" }, { status: 400 })
    }

    const context = await memoryManager.assembleContext(userId, sessionId, message)

    let response
    let actions = []

    if (type === "feedback") {
      // Process as structured feedback
      const feedbackResult = await feedbackProcessor.processFeedback(message, userId, sessionId)

      response = feedbackResult.response
      actions = feedbackResult.actions

      await memoryManager.storeConversationTurn(sessionId, message, response)
    } else {
      // Regular conversation with context awareness
      response = await generateContextualResponse(message, context)
      await memoryManager.storeConversationTurn(sessionId, message, response)
    }

    await memoryManager.updateUserContext(userId, {
      last_message: message,
      last_response: response,
      interaction_count: (context.userContext?.interaction_count || 0) + 1,
      last_active: new Date().toISOString(),
    })

    return NextResponse.json({
      response,
      actions,
      context: {
        hasHistory: context.recentHistory.length > 0,
        relevantMemories: context.relevantMemories.length,
        userEngagement: context.userContext?.engagement_level || "new",
      },
    })
  } catch (error) {
    console.error("Advanced bot error:", error)
    return NextResponse.json({ error: "Failed to process request", details: error.message }, { status: 500 })
  }
}

async function generateContextualResponse(message, context) {
  const { recentHistory, userContext, relevantMemories } = context

  // Build context-aware prompt
  const contextPrompt = `You are an intelligent feedback bot for Shipsy, a shipment management platform. 

User Context:
- Engagement Level: ${userContext.engagement_level || "new"}
- Previous Interactions: ${userContext.interaction_count || 0}
- Last Feedback Category: ${userContext.last_feedback_category || "none"}

Recent Conversation:
${recentHistory
  .slice(-3)
  .map((turn) => `${turn.role || "user"}: ${turn.message}`)
  .join("\n")}

Relevant Past Feedback:
${relevantMemories.map((memory) => `- ${memory.category}: ${memory.content.substring(0, 100)}...`).join("\n")}

Current Message: ${message}

Provide a helpful, contextual response that acknowledges the conversation history and any relevant past feedback. Be concise but personalized.`

  try {
    if (!process.env.GROQ_API_KEY) {
      return "I'm here to help with your Shipsy questions and feedback. How can I assist you today?"
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: contextPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "I understand your message. How can I help you further?"
  } catch (error) {
    console.error("LLM API error:", error)

    if (relevantMemories.length > 0) {
      return `I see you've provided feedback before about ${relevantMemories[0].category}. I'm here to help with any questions or feedback you have about Shipsy.`
    }

    if (recentHistory.length > 0) {
      return "I'm following our conversation and I'm here to help with any questions about Shipsy or to collect your feedback."
    }

    return "Hello! I'm your Shipsy feedback assistant. I'm here to help answer questions and collect your valuable feedback to improve our platform."
  }
}

async function getWebsiteContext(message) {
  const keywords = {
    dashboard: "The dashboard shows all your shipments with filtering and search capabilities.",
    login: "You can log in using the demo credentials: admin@shipsy.com / admin123",
    shipment: "You can create, edit, and delete shipments from the dashboard.",
    search: "Use the search bar to find shipments by name, ID, or destination.",
    filter: "Filter shipments by status (pending, in-transit, delivered) or type (domestic, international).",
  }

  const lowerMessage = message.toLowerCase()
  for (const [keyword, context] of Object.entries(keywords)) {
    if (lowerMessage.includes(keyword)) {
      return context
    }
  }

  return "Shipsy is a comprehensive shipment management platform for tracking and managing your logistics."
}

export async function GET() {
  try {
    const healthCheck = await memoryManager.healthCheck()

    return NextResponse.json({
      status: "Advanced bot system operational",
      features: ["Contextual memory", "Feedback processing", "Long-term learning", "User profiling"],
      health: healthCheck,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "Partial functionality",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
