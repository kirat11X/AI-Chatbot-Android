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

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim()

  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables.'
    })
  }

  const model = (process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash').trim()
  const body = req.body || {}
  const messages = body.messages || []

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' })
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }]
  }))

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: errData.error?.message || 'Google Gemini API returned an error.'
      })
    }

    const data = await response.json()
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!replyText) {
      return res.status(502).json({ error: 'Empty reply from Gemini model.' })
    }

    return res.status(200).json({
      reply: {
        content: replyText,
        role: 'assistant'
      }
    })
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Internal server error while communicating with Gemini.'
    })
  }
}
