'use strict';
const http = require('http');
const { washWindow, calendar } = require('./lib/guide');
const { page } = require('./lib/page');

function send(res, status, body, type) {
  const data = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(data);
}

function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method not allowed' });
  const url = new URL(req.url, 'http://localhost');
  try {
    switch (url.pathname) {
      case '/': return send(res, 200, page(), 'text/html; charset=utf-8');
      case '/healthz': return send(res, 200, { ok: true });
      case '/api/wash-window':
        return send(res, 200, washWindow(Object.fromEntries(url.searchParams)));
      case '/api/calendar': {
        const m = url.searchParams.get('month');
        return send(res, 200, calendar(m === null ? undefined : m));
      }
      default: return send(res, 404, { error: 'not found' });
    }
  } catch (e) {
    return send(res, e.status || 500, { error: e.status ? e.message : 'internal error' });
  }
}

function createServer() {
  return http.createServer(handler);
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080;
  createServer().listen(port, '0.0.0.0', () => console.log(`Abu Dhabi car care guide on :${port}`));
}

module.exports = { createServer };
