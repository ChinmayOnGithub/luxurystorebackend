import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Allow multiple origins for CORS
const allowedOrigins = ['http://localhost:5173', 'https://luxury-store-beryl.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials like cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Import routes
import userRouter from "../src/routes/user.routes.js";

// Routes
app.use(userRouter);

export { app };
