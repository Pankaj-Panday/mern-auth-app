import express from "express";
import "dotenv/config";
import connectDB from "./db/connect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import ApplicationError from "./utils/ApplicationError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import verifyToken from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("api is running");
});

app.use("/api/auth", authRouter);

// just for testing if protected routes are working or not
app.get("/api/products", verifyToken, (req, res) => {
  console.log(req.user);
  res.status(200).json({
    success: true,
    data: [
      { name: "product1", price: 1000 },
      { name: "product2", price: 2000 },
    ],
  });
});

// if no route above matches
app.all("*", (req, res, next) => {
  const err = new ApplicationError(
    404,
    `The requested url ${req.originalUrl} does not exist`
  );
  next(err);
});

// error handling middleware
app.use(globalErrorHandler);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `Server started on http://localhost:${PORT}`.bold.brightWhite
      );
    });
  })
  .catch((err) => {
    console.log("Some problem in the app connecting to database", err);
  });
