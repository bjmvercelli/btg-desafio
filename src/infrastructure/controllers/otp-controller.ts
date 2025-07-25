import { Request, Response } from 'express';
import { CreateOTPUseCase } from '@/application/use-cases/create-otp-use-case';
import { ValidateOTPUseCase } from '@/application/use-cases/validate-otp-use-case';
import { CreateOTPRequestDTO, ValidateOTPRequestDTO } from '@/application/dtos/otp-dto';
import { makeCreateOtpUseCase, makeValidateOtpUseCase } from '@/application/factories/use-case-factory';

export interface OTPController {
  createOTP(req: Request, res: Response): Promise<void>;
  validateOTP(req: Request, res: Response): Promise<void>;
}

export class OTPControllerImpl implements OTPController {
  constructor(
    private readonly createOTPUseCase: CreateOTPUseCase,
    private readonly validateOTPUseCase: ValidateOTPUseCase
  ) {}

  async createOTP(req: Request, res: Response): Promise<void> {
    try {
      const request: CreateOTPRequestDTO = {
        userId: req.body.userId,
      };

      const result = await this.createOTPUseCase.execute(request);

      res.status(201).json({
        success: true,
        data: result,
        message: 'OTP criado com sucesso',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async validateOTP(req: Request, res: Response): Promise<void> {
    try {
      const request: ValidateOTPRequestDTO = {
        token: req.query.token as string,
      };

      const result = await this.validateOTPUseCase.execute(request);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export function makeOtpController(): OTPController {
  return new OTPControllerImpl(makeCreateOtpUseCase(), makeValidateOtpUseCase());
} 