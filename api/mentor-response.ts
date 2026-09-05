import { handleMentorResponseServer } from '../src/server/apiServer.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const result = await handleMentorResponseServer(body.project, body.userMessageText);
    res.statusCode = 200;
    return res.json(result);
  } catch (err) {
    console.error('[API Error]', err);
    res.statusCode = 500;
    return res.json({ error: 'Server endpoint error' });
  }
}
