const http = require('http');

async function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testForgotPasswordFlow() {
  const email = 'jgamanuel@outlook.com';
  
  try {
    console.log('ETAPE 1: Demander le code OTP');
    const step1 = await makeRequest('POST', '/api/auth/forgot-password', { email });
    console.log('Status:', step1.status);
    console.log('Response:', JSON.stringify(step1.data, null, 2));
    
    if (!step1.data.debug_otp) {
      console.error('ERREUR: Aucun OTP généré');
      process.exit(1);
    }
    
    const otp = step1.data.debug_otp;
    console.log('\nOTP genere:', otp);
    
    console.log('\nETAPE 2: Verifier l\'OTP');
    const step2 = await makeRequest('POST', '/api/auth/verify-otp-password-reset', {
      email,
      code: otp
    });
    console.log('Status:', step2.status);
    console.log('Response:', JSON.stringify(step2.data, null, 2));
    
    if (step2.status !== 200) {
      console.error('ERREUR: OTP verification echouee');
      process.exit(1);
    }
    
    console.log('\nOTP verifie');
    
    console.log('\nETAPE 3: Reinitialiser le mot de passe');
    const step3 = await makeRequest('POST', '/api/auth/reset-password', {
      email,
      code: otp,
      newPassword: 'newpass12345'
    });
    console.log('Status:', step3.status);
    console.log('Response:', JSON.stringify(step3.data, null, 2));
    
    if (step3.status === 200) {
      console.log('\nSUCCES! Le mot de passe a ete reinitialise');
    } else {
      console.log('\nERREUR: La reinitialistion a echoue');
      console.log('Message:', step3.data.message);
    }
    
  } catch (error) {
    console.error('ERREUR:', error.message);
  }
}

testForgotPasswordFlow();
