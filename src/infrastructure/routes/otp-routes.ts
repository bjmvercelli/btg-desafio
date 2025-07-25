import { Router, Request, Response } from 'express';
import { makeOtpController } from '@/infrastructure/controllers/otp-controller';
import { validateCreateOTP, validateOTP } from '@/infrastructure/middleware/validation';

export class OTPRoutesImpl {
  private readonly otpController = makeOtpController();

  getRouter(): Router {
    const router = Router();

    router.post('/', validateCreateOTP, (req: Request, res: Response) => {
      this.otpController.createOTP(req, res);
    });

    router.post('/validate', validateOTP, (req: Request, res: Response) => {
      this.otpController.validateOTP(req, res);
    });

    return router;
  }
} 