import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload, type } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorBody);
      return res.status(response.status).json({ 
        error: errorBody?.error?.message || `API Error (${response.status})` 
      });
    }

    const result = await response.json();
    
    // Return the result based on the type
    if (type === 'quiz') {
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        return res.status(200).json({ recommendations: JSON.parse(jsonText) });
      } else {
        return res.status(500).json({ error: 'No recommendations received' });
      }
    } else if (type === 'career-path') {
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        return res.status(200).json({ careerPath: JSON.parse(jsonText) });
      } else {
        return res.status(500).json({ error: 'No career path received' });
      }
    } else {
      // Default to AI chat
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiResponse) {
        return res.status(200).json({ response: aiResponse });
      } else {
        return res.status(500).json({ error: 'No response from AI' });
      }
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
