import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [
      react(),
      {
        name: 'secure-api-endpoints-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/generate-project-ideas' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body || '{}');
                  if (env.GEMINI_API_KEY) {
                    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
                  }
                  const { handleGenerateIdeasServer } = await server.ssrLoadModule('./src/server/apiServer.ts');
                  const result = await handleGenerateIdeasServer(payload.profile);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err: any) {
                  console.error('[Vite API Middleware Error]:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Server endpoint error' }));
                }
              });
              return;
            }

            if (req.url === '/api/mentor-response' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body || '{}');
                  if (env.GEMINI_API_KEY) {
                    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
                  }
                  const { handleMentorResponseServer } = await server.ssrLoadModule('./src/server/apiServer.ts');
                  const result = await handleMentorResponseServer(payload.project, payload.userMessageText);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err: any) {
                  console.error('[Vite API Middleware Error]:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Server endpoint error' }));
                }
              });
              return;
            }

            if (req.url === '/api/project-pitch' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body || '{}');
                  if (env.GEMINI_API_KEY) {
                    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
                  }
                  const { handleProjectPitchServer } = await server.ssrLoadModule('./src/server/apiServer.ts');
                  const result = await handleProjectPitchServer(payload.project);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err: any) {
                  console.error('[Vite API Middleware Error]:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Server endpoint error' }));
                }
              });
              return;
            }

            next();
          });
        },
      },
    ],
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
