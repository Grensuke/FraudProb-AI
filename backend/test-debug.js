// Test the new ML features - detailed debug output
const http = require('http');

async function testURL(url, name) {
  return new Promise((resolve) => {
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
          console.log(`\n🔍 ${name}`);
          console.log(`URL: ${url}`);
          console.log(`Risk Score: ${result.riskScore}%`);
          console.log('\n📋 Threat Analysis:');
          if (result.threatAnalysis) {
            Object.entries(result.threatAnalysis).forEach(([key, value]) => {
              console.log(`  ${key}: ${value}`);
            });
          } else {
            console.log('  (no threatAnalysis object)');
          }
          console.log('\n🎯 Features Detected:');
          if (result.features) {
            console.log(`  isRecentlyRegisteredIndicator: ${result.features.isRecentlyRegisteredIndicator}`);
            console.log(`  hasSuspiciousParams: ${result.features.hasSuspiciousParams}`);
            console.log(`  hasSuspiciousSubdomain: ${result.features.hasSuspiciousSubdomain}`);
            console.log(`  hasRedirectChain: ${result.features.hasRedirectChain}`);
            console.log(`  internationalThreatMatch: ${result.features.internationalThreatMatch}`);
          }
          console.log('\n📝 First 3 Explanations:');
          result.explanations?.slice(0, 3).forEach(exp => console.log(`  • ${exp}`));
          resolve();
        } catch (e) {
          console.error(`Error: ${e.message}`);
          resolve();
        }
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

async function runTest() {
  await testURL("https://paypa1-verify.xyz/login?redirect=confirm&verify=security", "Phishing with suspicious params");
  await new Promise(resolve => setTimeout(resolve, 500));
  await testURL("https://verify.bank-secure.com/account/login", "Suspicious subdomain");
  await new Promise(resolve => setTimeout(resolve, 500));
  await testURL("https://bank123.store/confirm?action=verify&callback=admin", "Recently registered + suspicious params");
  process.exit(0);
}

runTest().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
