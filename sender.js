const fs = require('fs');
const http = require('http');
function send(target, b64) {
  return new Promise((res, rej) => {
    const req = http.request({
      host: '127.0.0.1',
      port: 49999,
      method: 'POST',
      headers: { 'x-target': target }
    }, r => {
      r.on('data', () => {});
      r.on('end', () => res(target));
    });
    req.on('error', rej);
    req.write(Buffer.from(b64, 'base64'));
    req.end();
  });
}
module.exports = { send };