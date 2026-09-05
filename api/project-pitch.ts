import { handleProjectPitchServer } from '../src/server/apiServer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const result = await handleProjectPitchServer(body.project);
    res.statusCode = 200;
    return res.json(result);
  } catch (err) {
    res.statusCode = 500;
    return res.json({ error: 'Server endpoint error' });
  }
}
