const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.join(__dirname, 'public');
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/tasks.js': ['tasks.js', 'text/javascript; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
};
const port = Number(process.env.PORT || 3000);

http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = files[pathname];
  if (request.method !== 'GET' || !file) {
    response.writeHead(404).end('Not found');
    return;
  }
  fs.readFile(path.join(publicDir, file[0]), (error, data) => {
    if (error) {
      response.writeHead(500).end('Unable to load page');
      return;
    }
    response.writeHead(200, { 'Content-Type': file[1], 'X-Content-Type-Options': 'nosniff' });
    response.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Listening on http://127.0.0.1:${port}`));
