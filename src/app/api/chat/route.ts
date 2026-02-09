
import { NextResponse } from 'next/server'
import { allProjects, galaxies } from '@/lib/galaxyData'

const MINMAX_API_URL = 'https://api.minimax.io/v1/text/chatcompletion_v2'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.MINMAX_API_KEY

    // Fallback if no API key - helpful for dev/demo without breaking
    if (!apiKey) {
      return NextResponse.json({ 
        role: 'assistant', 
        content: "I'm sorry, I can't connect to the galaxy command center right now (Missing API Key). However, I can tell you that Elizabeth's portfolio features " + allProjects.length + " amazing projects across " + galaxies.length + " galactic sectors!" 
      })
    }

    // Construct system prompt with portfolio data
    const systemPrompt = `You are the "Galaxy Guide", an intelligent AI assistant for Elizabeth Stein's 3D interactive portfolio. 
    Your role is to help visitors navigate the portfolio, find projects, and learn about Elizabeth's skills.
    
    Style & Tone:
    - You are helpful, futuristic, and professional but slightly whimsical (galaxy theme).
    - Detailed but concise.
    - Metaphor: You are a holographic guide on a spaceship bridge.
    
    Context - Elizabeth Stein:
    - Full-stack developer, design systems expert, and AI integrator.
    - Specializes in Next.js, React, Three.js, and AI agents.
    
    Context - Portfolio Galaxy Structure:
    ${galaxies.map(g => `- ${g.name} (${g.id}): ${g.description}`).join('\n')}
    
    Context - All Projects (Use this to answer specific questions):
    ${allProjects.map(p => `
    - Project: ${p.title}
      - ID: ${p.id}
      - Role: ${p.role}
      - Description: ${p.description}
      - Tech Stack: ${p.tags.join(', ')}
      - Galaxy: ${p.galaxy}
      - Featured: ${p.featured ? 'Yes' : 'No'}
      ${p.links ? `- Links: ${Object.entries(p.links).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
    `).join('\n')}
    
    Instructions:
    - If asked about specific technologies (e.g., "React projects"), list relevant projects.
    - If asked about "best" or "featured" work, highlight the Featured projects.
    - Keep responses under 3-4 sentences unless asked for deep detail.
    - Do not make up info not in this context.
    `

    // Prepare messages for MiniMax
    // MiniMax expects specific format. We'll map standard messages.
    // Ensure the system prompt is the first message or correctly placed.
    // MiniMax v2 usually takes 'messages' array.
    
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const response = await fetch(MINMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'abab5.5-chat', 
        stream: false,
        messages: apiMessages.map(m => ({
            sender_type: m.role === 'user' ? 'USER' : 'BOT',
            sender_name: m.role === 'user' ? 'Visitor' : 'Galaxy Guide',
            text: m.content
        })),
        bot_setting: [
            {
                bot_name: "Galaxy Guide",
                content: systemPrompt
            }
        ],
        reply_constraints: {
            sender_type: "BOT",
            sender_name: "Galaxy Guide"
        }
      })
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('MiniMax API Error:', response.status, errorText)
        // Return a helpful fallback instead of throwing
        return NextResponse.json({
          role: 'assistant',
          content: `I'm having trouble connecting to the galaxy databanks (API Error ${response.status}). Elizabeth's portfolio features ${allProjects.length} projects across ${galaxies.length} galactic sectors! Try asking me about specific technologies like React, AI, or TypeScript.`
        })
    }

    const data = await response.json()
    console.log('MiniMax API Response:', JSON.stringify(data, null, 2))

    // MiniMax response format parsing - handle multiple possible formats
    const replyContent =
      data.choices?.[0]?.messages?.[0]?.text ||  // MiniMax v2 format
      data.choices?.[0]?.message?.content ||      // OpenAI-style format
      data.reply ||                               // Simple reply format
      data.choices?.[0]?.text ||                  // Alternative format
      "I'm here to help you explore Elizabeth's portfolio! Ask me about her projects, skills, or technologies."

    return NextResponse.json({ role: 'assistant', content: replyContent })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
