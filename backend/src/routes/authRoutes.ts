import { Router } from 'express';
import { googleAuth, googleCallback } from '../controllers/authController';
import { google } from 'googleapis';
import passport from 'passport';
const router = Router();
import axios from 'axios';
import cookie from 'cookie';
import { fetchGmailEmails, fetchOutlookMails } from './helpers/getMails';

// router.get('/google', googleAuth);
// router.get('/google/callback', googleCallback);

router.post('/fetchOutlookMails', fetchOutlookMails);
router.post('/fetchGmailEmails', fetchGmailEmails);

// Endpoint to get the OAuth URL and redirect
router.get('/microsoft', (req, res) => {
  const state = req.query.state;
  const clientID = process.env.MS_CLIENT_ID;
  const redirectURL = encodeURIComponent(process.env.MS_REDIRECT_URI!);
  
  const url = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}&response_mode=query&scope=Mail.Read offline_access&state=${state}`;
  
  return res.redirect(url);
});

// Callback endpoint to handle the OAuth response
router.get('/microsoft/callback', async (req, res) => {
  const code = req.query.code as string;
  const sessionState = req.query.session_state as string;

  if (!code) {
    return res.status(400).send("Authorization code not found.");
  }

  const tokenResponse = await exchangeCodeForToken(code, sessionState);
  if (!tokenResponse) {
    return res.status(500).send("Error exchanging authorization code for token.");
  }
  const accessToken = tokenResponse.access_token;
   // Set the access token in a cookie
   res.setHeader('Set-Cookie', cookie.serialize('access_token_ms', accessToken, {
    httpOnly: false, // Prevent client-side access
    secure: true, // Use secure cookies in production
    maxAge: 3600, // Cookie expiration time in seconds (1 hour)
    path: '/', // Path for the cookie
    sameSite:'none'
  }));

  // Redirect to the frontend dashboard with the access token
  const redirectUrl = `http://localhost:5173/dashboard`;
  return res.redirect(redirectUrl);

  //return res.json(tokenResponse); // Return token response (access token, refresh token, etc.)
});

// Function to exchange the authorization code for an access token
const exchangeCodeForToken = async (code: string, sessionState: string) => {
  const clientID = process.env.MS_CLIENT_ID as string;
  const redirectURL = process.env.MS_REDIRECT_URI as string;
  const secret = process.env.MS_CLIENT_SECRET as string;
  
  const tokenEndpoint = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
  
  const tokenRequestParams = new URLSearchParams({
    client_id: clientID,
    scope: 'Mail.Read offline_access',
    code,
    session_state: sessionState,
    redirect_uri: redirectURL,
    grant_type: 'authorization_code',
    client_secret: secret
  });
  
  try {
    const response = await axios.post(tokenEndpoint, tokenRequestParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // Return the token response
  } catch (error) {
    console.error('Error exchanging authorization code for token:', error);
    return null;
  }
};

// Endpoint to refresh access token
router.get('/RefreshToken', async (req, res) => {
  const refreshToken = req.query.refresh_token as string;

  const tokenResponse = await refreshAccessToken(refreshToken);
  if (!tokenResponse) {
    return res.status(500).send("Error refreshing access token.");
  }

  return res.json(tokenResponse); // Return the new token response
});

// Function to refresh the access token
const refreshAccessToken = async (refreshToken: string) => {
  const tenantID = process.env.MS_TENANT_ID; // Add your tenant ID if required
  const clientID = process.env.MS_CLIENT_ID as string;
  const redirectURL = process.env.MS_REDIRECT_URI as string;
  const secret = process.env.MS_CLIENT_SECRET as string;

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;

  const refreshTokenParams = new URLSearchParams({
    client_id: clientID,
    scope: 'Mail.Read offline_access',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_secret: secret,
  });

  try {
    const response = await axios.post(tokenEndpoint, refreshTokenParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // Return the new token response
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};





// Route to authenticate via Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose']
  }));
  
  // Callback route for Google OAuth
  router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/', // Redirect on failure
    session: true
  }), (req, res) => {
    // On success, redirect to frontend with token in the query string
    const user = req.user as any;
    const accessToken = user.accessToken;
    
     // Set the access token in a cookie
  res.setHeader('Set-Cookie', cookie.serialize('access_token_g', accessToken, {
    httpOnly: false, // Prevent client-side access
    secure: true, // Use secure cookies in production
    maxAge: 3600, // Cookie expiration time in seconds (1 hour)
    path: '/', // Path for the cookie
    sameSite: 'none', 
  }));
  
    // Redirect to frontend with access token
    res.redirect(`http://localhost:5173/dashboard`);
  });

// New route to fetch emails
router.get('/emails', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  
    oauth2Client.setCredentials({ access_token: accessToken });
  
    try {
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const response = await gmail.users.messages.list({ userId: 'me' });
      
      // Fetch detailed email data if needed
      const emails = response.data.messages || [];
      res.json(emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  });



export default router;
