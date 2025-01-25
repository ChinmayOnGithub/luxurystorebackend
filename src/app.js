import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`, // Your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json());
app.use(express.urlencoded({ extende: true, limit: "16kb" }));
app.use(cookieParser())
app.use(express.static("public"));

// import routes
import userRouter from "../src/routes/user.routes.js";
import otpRouter from "../src/routes/otp.routes.js"
import adminRouter from "../src/routes/admin.routes.js";

// routes   
app.use(userRouter);
app.use('/otp', otpRouter);
app.use(adminRouter);





export { app }