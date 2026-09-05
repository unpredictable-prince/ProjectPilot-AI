import { handleGenerateIdeasServer } from '../src/server/apiServer.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const result = await handleGenerateIdeasServer(body.profile);
    res.statusCode = 200;
    return res.json(result);
  } catch (err) {
    console.error('[API Error]', err);
    res.statusCode = 500;
    return res.json({ error: 'Server endpoint error' });
  }
}
