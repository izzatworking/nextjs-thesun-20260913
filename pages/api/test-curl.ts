import type { NextApiRequest, NextApiResponse } from 'next';

const queries = [
  { label: 'GraphQL API', url: 'https://thesun.my/thesun-api', body: JSON.stringify({ query: '{ posts { nodes { id title } } }' }) },
  { label: 'YouTube API', url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=MY&maxResults=1&key=DEMO' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = [];

  for (const q of queries) {
    try {
      const start = Date.now();
      const response = await fetch(q.url, {
        method: q.body ? 'POST' : 'GET',
        headers: q.body ? { 'Content-Type': 'application/json' } : undefined,
        body: q.body || undefined,
        signal: AbortSignal.timeout(15000),
      });
      const text = await response.text();
      results.push({
        label: q.label,
        url: q.url,
        status: response.status,
        elapsed: Date.now() - start + 'ms',
        body: text.slice(0, 300),
        headers: Object.fromEntries(response.headers),
      });
    } catch (e: any) {
      results.push({
        label: q.label,
        url: q.url,
        error: e.message,
        code: e.code,
        cause: e.cause?.message,
      });
    }
  }

  res.status(200).json(results);
}
