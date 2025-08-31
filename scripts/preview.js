import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Simple static file server for local preview of the playable.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const server = http.createServer(async (req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  try {
    const data = await readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 5173;
server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
});