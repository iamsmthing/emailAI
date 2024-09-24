import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import './passport';
import cookieParser from 'cookie-parser';
import passport from 'passport';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());



  // Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
    }
  }));


  // Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
