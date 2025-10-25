import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './api/v1/routes/user.routes';
require('dotenv').config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

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

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});