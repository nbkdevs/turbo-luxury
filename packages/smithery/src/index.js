#!/usr/bin/env node
import http from 'node:http';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';

/** Stateless Streamable HTTP endpoint at /mcp, used by Smithery's container runtime. */
export function createHttpServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"ok":true}');
      return;
    }
    if (url.pathname !== '/mcp') {
      res.writeHead(404, { 'Content-Type': 'application/json' }).end('{"error":"not found"}');
      return;
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' })
        .end('{"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed."},"id":null}');
      return;
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' })
        .end('{"jsonrpc":"2.0","error":{"code":-32700,"message":"Parse error"},"id":null}');
      return;
    }
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => { transport.close(); server.close(); });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  });
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('turbo-luxury-mcp')) {
  if (process.env.PORT) {
    const port = Number(process.env.PORT);
    createHttpServer().listen(port, '0.0.0.0', () => console.error(`turbo-luxury-mcp listening on :${port}/mcp`));
  } else {
    await createServer().connect(new StdioServerTransport());
  }
}
