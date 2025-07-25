import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { OTPRoutesImpl } from '@/infrastructure/routes/otp-routes';
import { logger } from '@/infrastructure/config/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const otpRoutes = new OTPRoutesImpl();
app.use('/api/otp', otpRoutes.getRouter());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'BTG OTP API',
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
  });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Health check available at http://localhost:${port}/health`);
}); 