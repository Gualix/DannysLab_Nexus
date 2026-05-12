// Node server entry: wraps the built TanStack Start fetch handler
// and serves dist/client as static assets.
import { serve } from "srvx";
import { serveStatic } from "srvx/static";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distServerEntry = resolve(__dirname, "dist/server/server.js");
const clientDir = resolve(__dirname, "dist/client");

const { default: app } = await import(distServerEntry);

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOST ?? "0.0.0.0";

serve({
  port,
  hostname,
  middleware: [serveStatic({ dir: clientDir })],
  fetch: (request) => app.fetch(request),
});

console.log(`▲ Listening on http://${hostname}:${port}`);
