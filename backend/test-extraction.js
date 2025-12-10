// Direct test of extractURLFeatures
const testURL = "https://paypa1-verify.xyz/login?redirect=confirm&verify=security";

// Simulate the extraction logic
const url = testURL;
const urlObj = new URL(url);
const domain = urlObj.hostname;  // paypa1-verify.xyz
const urlLower = url.toLowerCase();
const domainParts = domain.split('.');  // ['paypa1-verify', 'xyz']

// Check suspicious params
const SUSPICIOUS_PARAMS = [
  'redirect', 'return', 'callback', 'action=login', 'action=verify',
  'form=login', 'login_page', 'verify_page', 'page=login',
  'redir', 'ref', 'return_to', 'goto', 'url', 'returnUrl'
];

const hasSuspiciousParams = SUSPICIOUS_PARAMS.some(param => urlLower.includes(param));
console.log(`hasSuspiciousParams test: ${hasSuspiciousParams}`);
console.log(`  URL includes 'redirect': ${urlLower.includes('redirect')}`);
console.log(`  URL includes 'verify': ${urlLower.includes('verify')}`);

// Check recently registered
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.work', '.online',
  '.site', '.space', '.store', '.click', '.download', '.racing',
  '.win', '.stream', '.accountant', '.party', '.science', '.webcam',
  '.review', '.date', '.faith', '.men', '.fitness'
];

const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
const isNumberedDomain = /\d{1,4}$/.test(domainParts[0]);
const isShortDomain = domain.length < 8;
const isRecentlyRegisteredIndicator = hasSuspiciousTLD || isNumberedDomain || isShortDomain;

console.log(`\nisRecentlyRegisteredIndicator test: ${isRecentlyRegisteredIndicator}`);
console.log(`  Domain: ${domain}`);
console.log(`  Domain parts: ${JSON.stringify(domainParts)}`);
console.log(`  Has suspicious TLD: ${hasSuspiciousTLD}`);
console.log(`  Is numbered domain: ${isNumberedDomain}`);
console.log(`  Is short domain: ${isShortDomain} (length=${domain.length})`);

// Check suspicious subdomain
const TRUSTED_DOMAINS = ['google.com', 'github.com'];
const isTrustedDomain = TRUSTED_DOMAINS.some(trusted => domain.includes(trusted));
const SUSPICIOUS_SUBDOMAINS = ['verify', 'secure', 'login', 'account'];
const hasSuspiciousSubdomain = SUSPICIOUS_SUBDOMAINS.some(sub => 
  domain.includes(sub) && !isTrustedDomain
);

console.log(`\nhasSuspiciousSubdomain test: ${hasSuspiciousSubdomain}`);
console.log(`  Domain includes 'verify': ${domain.includes('verify')}`);
console.log(`  Is trusted: ${isTrustedDomain}`);

// Check redirect chain
const pathParts = urlObj.pathname.split('/').filter(p => p.length > 0);
const hasRedirectChain = (urlObj.pathname.match(/\//g) || []).length > 5 && urlLower.includes('redirect');
console.log(`\nhasRedirectChain test: ${hasRedirectChain}`);
console.log(`  Slashes: ${(urlObj.pathname.match(/\//g) || []).length}`);
console.log(`  Includes 'redirect': ${urlLower.includes('redirect')}`);
