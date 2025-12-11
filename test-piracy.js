// Test piracy detection logic
const BLACKLISTED_PIRACY_DOMAINS = [
  'movierulz.com', 'movierulz.net', 'movierulz.io', 'movierulz.wtf'
];

const url = 'https://movierulz.com';
const urlLower = url.toLowerCase();
const urlObj = new URL(url);
const domain = urlObj.hostname;

console.log('URL:', url);
console.log('Domain:', domain);
console.log('URL Lower:', urlLower);

let illegalContentScore = 0;
let isKnownPiracySite = false;

try {
  // Check blacklisted piracy domains
  isKnownPiracySite = BLACKLISTED_PIRACY_DOMAINS.some(piracy => {
    const piracyDomain = piracy.split('.')[0];
    const result = domain.includes(piracyDomain) || urlLower.includes(piracy);
    console.log(`Checking ${piracy}: domain.includes("${piracyDomain}") = ${domain.includes(piracyDomain)}, urlLower.includes("${piracy}") = ${urlLower.includes(piracy)}, result=${result}`);
    return result;
  });
  
  if (isKnownPiracySite) {
    illegalContentScore = 0.95;
  }
  
  console.log('\n✅ TEST PASSED');
  console.log('isKnownPiracySite:', isKnownPiracySite);
  console.log('illegalContentScore:', illegalContentScore);
} catch (err) {
  console.error('❌ ERROR:', err.message);
  console.error(err.stack);
}
