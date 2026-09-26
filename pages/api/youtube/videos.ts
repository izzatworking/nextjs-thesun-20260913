import { NextApiRequest, NextApiResponse } from 'next';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ success: false, message: 'YOUTUBE_API_KEY not configured', items: [] });
  }

  const maxResults = typeof req.query.maxResults === 'string' ? req.query.maxResults : '10';

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=the+sun+malaysia&type=video&part=snippet,id&order=date&maxResults=${maxResults}`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.error?.message || 'YouTube API error',
        items: [],
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    return res.status(200).json({
      success: true,
      items: Array.isArray(data.items) ? data.items : [],
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch videos', items: [] });
  }
}
