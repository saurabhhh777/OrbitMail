const dns = require('dns');

async function testDNSVerification() {
  const domain = 'voidmail.fun';
  
  console.log(`Testing DNS verification for domain: ${domain}`);
  console.log('Expected MX records:');
  console.log('- mx1.orbitmail.fun (priority 10)');
  console.log('- mx2.orbitmail.fun (priority 20)');
  console.log('- mx3.orbitmail.fun (priority 30)');
  console.log('');
  
  try {
    // Lookup MX records
    const mxRecords = await dns.promises.resolveMx(domain);
    console.log('Found MX records:');
    mxRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.exchange} (priority: ${record.priority})`);
    });
    
    const mxHosts = mxRecords.map(r => r.exchange.toLowerCase());
    
    // Check for required MX records
    const hasMX1 = mxHosts.includes('mx1.orbitmail.fun');
    const hasMX2 = mxHosts.includes('mx2.orbitmail.fun');
    const hasMX3 = mxHosts.includes('mx3.orbitmail.fun');
    
    console.log('');
    console.log('Verification Results:');
    console.log(`- mx1.orbitmail.fun: ${hasMX1 ? '✅ Found' : '❌ Missing'}`);
    console.log(`- mx2.orbitmail.fun: ${hasMX2 ? '✅ Found' : '❌ Missing'}`);
    console.log(`- mx3.orbitmail.fun: ${hasMX3 ? '✅ Found' : '❌ Missing'}`);
    
    const isVerified = hasMX1 && hasMX2 && hasMX3;
    console.log('');
    console.log(`Domain verification: ${isVerified ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (!isVerified) {
      console.log('');
      console.log('Missing MX records:');
      if (!hasMX1) console.log('- mx1.orbitmail.fun');
      if (!hasMX2) console.log('- mx2.orbitmail.fun');
      if (!hasMX3) console.log('- mx3.orbitmail.fun');
    }
    
  } catch (error) {
    console.error('DNS lookup failed:', error.message);
  }
}

testDNSVerification(); 