import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import boardsRoutes from './routes/boards';
import statusRoutes from './routes/status';
import taskRoutes from './routes/task';
import { config } from 'dotenv';

// Dotenv
config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/boards', boardsRoutes);
app.use('/status', statusRoutes);
app.use('/task', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
