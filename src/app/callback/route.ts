import querystring from 'querystring';
// Generate a random code_verifier
const codeVerifier = "3b2ad25620352fb71cde7f6fa68a2c3cf42aa3eaa1fc3fa6ebebc89f02df3b2b";

const PORT = 4000;
const CLIENT_ID = 'app1';
const CLIENT_SECRET = 'app1_secret';
const OIDC_ISSUER = 'https://oidc-dev-gmgue4e7aebca3g8.australiaeast-01.azurewebsites.net';
// const OIDC_ISSUER = 'http://127.0.0.1:3000';
const REDIRECT_URI = `https://127.0.0.1:${PORT}/callback`;

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // Exchange the code for tokens
  try {
    const tokenUrl = `${OIDC_ISSUER}/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokenResponse.ok) {
      return new Response(JSON.stringify({ tokens }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: tokens }), { status: 400 });
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return new Response('Error exchanging code for tokens', { status: 500 });
  }
}