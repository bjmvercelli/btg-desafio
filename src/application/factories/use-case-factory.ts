import { CreateOTPUseCase, CreateOTPUseCaseImpl } from '@/application/use-cases/create-otp-use-case';
import { ValidateOTPUseCase, ValidateOTPUseCaseImpl } from '@/application/use-cases/validate-otp-use-case';
import { OTPRepository } from '@/domain/repositories/otp-repository';
import { SQLiteOTPRepository } from '@/infrastructure/database/sqlite-otp-repository';
import * as fs from 'fs';
import * as path from 'path';

// Ensure database directory exists before creating repository
const dbPath = process.env.DB_PATH || './database/otp.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const otpRepository: OTPRepository = new SQLiteOTPRepository(dbPath);
const expirationTime = parseInt(process.env.OTP_EXPIRATION_TIME || '300000'); // 5 minutes in milliseconds
const tokenLength = parseInt(process.env.OTP_LENGTH || '6');

export function makeCreateOtpUseCase(): CreateOTPUseCase {
  return new CreateOTPUseCaseImpl(otpRepository, expirationTime, tokenLength);
}

export function makeValidateOtpUseCase(): ValidateOTPUseCase {
  return new ValidateOTPUseCaseImpl(otpRepository);
} 