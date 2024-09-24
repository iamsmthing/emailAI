import { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_REDIRECT_URI!,
},
(accessToken, refreshToken, profile, done) => {
  // In a real app, you'd save the profile and tokens in the database here
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Route Handlers

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose'],
});
export const googleCallback = [
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req: Request, res: Response) => {
      // Assuming the user is authenticated and you have their tokens
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
  
      // Get tokens
      const { tokens } = await oauth2Client.getToken(req.query.code as string);
      oauth2Client.setCredentials(tokens);
  
      // You might want to store the tokens in a session or database for later use
      // Here, we're just redirecting to the frontend with the access token
      const redirectUrl = `http://localhost:5173/dashboard?access_token=${tokens.access_token}`;
      
      res.redirect(redirectUrl);
    }
  ];
