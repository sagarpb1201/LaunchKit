import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './api/v1/routes/user.routes';
require('dotenv').config();
import { errorHandler } from './api/v1/middlwares/error.middlware';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Launchkit API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/users', userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});