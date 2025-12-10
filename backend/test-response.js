// Test the actual API response
const http = require('http');

async function testURL() {
  return new Promise((resolve) => {
    const url = "https://paypa1-verify.xyz/login?redirect=confirm&verify=security";
    const postData = JSON.stringify({ url, message: url });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          // Print full features object
          console.log('Full response.features object:');
          console.log(JSON.stringify(result.features, null, 2));
        } catch (e) {
          console.error(`Error: ${e.message}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

testURL().then(() => process.exit(0));
