import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request) {
  try {
    const { message } = await request.json()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant for Shipsy, a shipment management platform. Help users with questions about shipping, logistics, tracking, and using the platform. Be concise, friendly, and professional. Focus on shipment-related topics.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
    })

    return Response.json({
      message: completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.",
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
