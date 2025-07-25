import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import { OTPRoutesImpl } from '@/infrastructure/routes/otp-routes';
import { logger } from '@/infrastructure/config/logger';
import { specs } from '@/infrastructure/config/swagger';

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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verifica o status da API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-25T02:35:19.176Z"
 *                 service:
 *                   type: string
 *                   example: "BTG OTP API"
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'BTG OTP API',
  });
});

// @ts-ignore
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const otpRoutes = new OTPRoutesImpl();
app.use('/api/otp', otpRoutes.getRouter());

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
  logger.info(`API documentation available at http://localhost:${port}/api-docs`);
}); 