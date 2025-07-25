import { Router, Request, Response } from 'express';
import { makeOtpController } from '@/infrastructure/controllers/otp-controller';
import { validateCreateOTP } from '@/infrastructure/middleware/validation';

export class OTPRoutesImpl {
  private readonly otpController = makeOtpController();

  getRouter(): Router {
    const router = Router();

    /**
     * @swagger
     * /api/otp:
     *   post:
     *     summary: Criar um novo token OTP
     *     description: Gera um token OTP único de 6 dígitos com tempo de expiração
     *     tags: [OTP]
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateOTPRequest'
     *     responses:
     *       201:
     *         description: Token OTP criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateOTPResponse'
     *       400:
     *         description: Dados inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.post('/', validateCreateOTP, (req: Request, res: Response) => {
      this.otpController.createOTP(req, res);
    });

    /**
     * @swagger
     * /api/otp/validate:
     *   get:
     *     summary: Validar um token OTP
     *     description: Valida um token OTP verificando se é válido, não expirado e não usado
     *     tags: [OTP]
     *     parameters:
     *       - in: query
     *         name: token
     *         required: true
     *         schema:
     *           type: string
     *         description: Token OTP a ser validado
     *         example: "123456"
     *     responses:
     *       200:
     *         description: Token validado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ValidateOTPResponse'
     *       400:
     *         description: Dados inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.get('/validate', (req: Request, res: Response) => {
      this.otpController.validateOTP(req, res);
    });

    return router;
  }
} 