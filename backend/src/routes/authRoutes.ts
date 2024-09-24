import { Router } from 'express';
import { googleAuth, googleCallback } from '../controllers/authController';
import { google } from 'googleapis';
import passport from 'passport';
const router = Router();

// router.get('/google', googleAuth);
// router.get('/google/callback', googleCallback);

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
  
    // Redirect to frontend with access token
    res.redirect(`http://localhost:5173/dashboard?token=${accessToken}`);
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
