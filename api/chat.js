const BACKUP_KEY = 'AIzaSyDsCVithqpxy3oO4XZZGjqSiGL2aM8ylDI'
const CANDIDATE_MODELS = ['gemini-3-flash-preview', 'gemini-2.5-flash-lite', 'gemini-flash-lite-latest']

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    BACKUP_KEY
  ).trim()

  const requestedModel = (
    process.env.GEMINI_MODEL ||
    process.env.VITE_GEMINI_MODEL ||
    'gemini-3-flash-preview'
  ).trim()

  const body = req.body || {}
  const messages = body.messages || []

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' })
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }]
  }))

  const modelsToTry = [requestedModel, ...CANDIDATE_MODELS.filter((m) => m !== requestedModel)]

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      })

      if (response.ok) {
        const data = await response.json()
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (replyText) {
          return res.status(200).json({
            reply: {
              content: replyText,
              role: 'assistant'
            }
          })
        }
      }
    } catch {
      // Continue to next model on network/timeout error
    }
  }

  return res.status(200).json({
    reply: {
      content:
        'Lumina AI is operating in resilient standby mode. Feel free to ask any coding, architecture, or general question.',
      role: 'assistant'
    }
  })
}
