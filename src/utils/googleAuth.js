const { OAuth2Client } = require('google-auth-library');

async function verifyGoogleToken(token) {
  try {
    console.log('Starting token verification...');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    console.log('Using CLIENT_ID:', clientId);
    
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    });
    
    return ticket.getPayload();
  } catch (error) {
    console.error('Token verification error details:', error);
    throw error;
  }
}

export default verifyGoogleToken;