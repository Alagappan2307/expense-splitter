const http = require('http');
function sendFile(target, content) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port: 49999,
      method: 'POST',
      headers: { 'x-target': target }
    }, res => {
      res.on('data', () => {});
      res.on('end', () => resolve(target));
    });
    req.on('error', reject);
    req.write(Buffer.from(content, 'utf8'));
    req.end();
  });
}
module.exports = { sendFile };