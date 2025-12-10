// Test the new ML features
const http = require('http');

const testCases = [
  {
    name: "Recently registered domain with phishing pattern",
    url: "https://paypa1-verify.xyz/login?redirect=confirm"
  },
  {
    name: "Suspicious subdomain with parameters",
    url: "https://verify.amazon-payment.com/account?action=login&return=checkout"
  },
  {
    name: "Redirect chain with suspicious params",
    url: "https://bank-update.com/verify/redirect?callback=admin&action=verify"
  },
  {
    name: "International threat DB match (ICICI - RBI fraud pattern)",
    url: "https://icici-banking-secure.com/neft-rtgs-update"
  },
  {
    name: "Safe URL (Google)",
    url: "https://google.com"
  },
  {
    name: "Legitimate bank (no threats)",
    url: "https://amazon.com/account/login"
  }
];

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
          console.log(`\n✅ ${name}`);
          console.log(`   URL: ${url}`);
          console.log(`   Risk Score: ${result.riskScore}% (${result.verdict})`);
          console.log(`   Confidence: ${result.confidence}`);
          console.log(`   Domain Age Indicator: ${result.features?.isRecentlyRegisteredIndicator ? '⚠️ YES' : '✓ NO'}`);
          console.log(`   Suspicious Params: ${result.features?.hasSuspiciousParams ? '⚠️ YES' : '✓ NO'}`);
          console.log(`   Suspicious Subdomain: ${result.features?.hasSuspiciousSubdomain ? '⚠️ YES' : '✓ NO'}`);
          console.log(`   Redirect Chain: ${result.features?.hasRedirectChain ? '⚠️ YES' : '✓ NO'}`);
          console.log(`   International Threat: ${result.features?.internationalThreatMatch ? '🌍 YES' : '✓ NO'}`);
          console.log(`   Phishing Patterns: ${result.features?.phishingPatterns || 0} detected`);
          resolve();
        } catch (e) {
          console.error(`❌ Error parsing response: ${e.message}`);
          resolve();
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request error: ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TESTING NEW ML ENGINE FEATURES (25+ Advanced Detectors)');
  console.log('='.repeat(70));

  for (const testCase of testCases) {
    await testURL(testCase.url, testCase.name);
    await new Promise(resolve => setTimeout(resolve, 300)); // Small delay
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Testing complete!');
  console.log('='.repeat(70) + '\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
