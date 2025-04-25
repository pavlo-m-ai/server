import { createServer } from 'node:http';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs'; 
import { URL } from 'url';
import path from 'node:path';

const logsDir = './logs';
if (!existsSync(logsDir)) {
  mkdirSync(logsDir);
}

function getLogStream() {
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const logFilePath = path.join(logsDir, `${dateStr}.log`);
  return createWriteStream(logFilePath, { flags: 'a' });
}

const server = createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost');

  switch (reqUrl.pathname) {
    case '/': {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1 style="font-size: 24px; font-weight: bold;">Selling banana, humans!</h1>');
        break;
    }
    
    case '/user': {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1 style="font-size: 24px; font-weight: bold;">Joking not bananas</h1>');
        break;
    }
    
    case '/favicon.ico': {
        readFile("C:\\Users\\Fedor\\.vscode\\cli\\favicon.ico", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading favicon.ico\n');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            res.end(data);
        });
        break;
    }
    
    default: {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1 style="font-size: 24px; font-weight: bold;">404 not found</h1>');
        break;
    }
  }
  
  const clientIP = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const logEntry = `Time: ${new Date().toISOString()}, IP: ${clientIP}, User-Agent: ${userAgent} \n`;

  const logStream = getLogStream();
  logStream.write(logEntry);
});

server.listen(4000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:4000');
});
