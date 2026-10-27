import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { listPackages, recommendPackage, washWindow, monthTip, bookingLink } from './core.js';

const text = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] });
const fail = (e) => ({ isError: true, content: [{ type: 'text', text: e.message }] });
const safe = (fn) => (args) => {
  try { return text(fn(args)); } catch (e) { return fail(e); }
};
const readOnly = { readOnlyHint: true, openWorldHint: false };

export function createServer() {
  const server = new McpServer({ name: 'turbo-luxury-mcp', version: '1.0.0' });

  server.registerTool('list_packages', {
    title: 'List mobile car wash packages',
    description: 'List the mobile car wash packages in Abu Dhabi with prices in AED and what each includes.',
    inputSchema: {},
    annotations: readOnly
  }, safe(() => listPackages()));

  server.registerTool('recommend_package', {
    title: 'Recommend a package',
    description: 'Recommend the cheapest package that covers the stated needs (wax, deep interior clean, engine bay, sanitization, stained seats, AC smell, hazy headlights).',
    inputSchema: {
      wantsWax: z.boolean().optional(), interiorDirty: z.boolean().optional(), wantsEngineClean: z.boolean().optional(),
      wantsSanitization: z.boolean().optional(), seatsStained: z.boolean().optional(), acSmell: z.boolean().optional(),
      hazyHeadlights: z.boolean().optional(), justMaintenance: z.boolean().optional()
    },
    annotations: readOnly
  }, safe(recommendPackage));

  server.registerTool('wash_window_check', {
    title: 'Is it a good time to wash the car?',
    description: 'Score the current outdoor washing window in Abu Dhabi from temperature (C), wind (km/h), dust PM10 (ug/m3) and humidity (%). Give at least one.',
    inputSchema: {
      temp: z.number().optional(), wind: z.number().optional(), dust: z.number().optional(), humidity: z.number().optional()
    },
    annotations: readOnly
  }, safe(washWindow));

  server.registerTool('monthly_care_tip', {
    title: 'Car care tip for a month',
    description: 'Get the car care tip for a month in Abu Dhabi climate (1 = January, 12 = December).',
    inputSchema: { month: z.number().int().min(1).max(12) },
    annotations: readOnly
  }, safe(({ month }) => ({ month, tip: monthTip(month) })));

  server.registerTool('booking_link', {
    title: 'WhatsApp booking link',
    description: 'Build a WhatsApp link with a prefilled booking message for a package. The user opens it and sends the message; nothing is sent automatically.',
    inputSchema: {
      packageId: z.enum(['quick', 'golden', 'diamond', 'detailing']).optional(),
      area: z.string().max(80).optional(), vehicle: z.string().max(80).optional(), preferredTime: z.string().max(80).optional()
    },
    annotations: readOnly
  }, safe(bookingLink));

  return server;
}
