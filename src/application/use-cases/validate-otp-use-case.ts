import { OTPRepository } from '@/domain/repositories/otp-repository';
import { ValidateOTPRequestDTO, ValidateOTPResponseDTO } from '@/application/dtos/otp-dto';
import { Otp } from '@/domain/entities/otp';

export interface ValidateOTPUseCase {
  execute(request: ValidateOTPRequestDTO): Promise<ValidateOTPResponseDTO>;
}

export class ValidateOTPUseCaseImpl implements ValidateOTPUseCase {
  constructor(private readonly otpRepository: OTPRepository) {}

  async execute(request: ValidateOTPRequestDTO): Promise<ValidateOTPResponseDTO> {
    const { token } = request;
    const now = new Date();

    const otp = await this.otpRepository.findByToken(token);

    if (!otp) {
      return {
        isValid: false,
        message: 'Token não encontrado',
      };
    }

    if (otp.isUsed) {
      return {
        isValid: false,
        message: 'Token já foi utilizado',
      };
    }

    if (now > otp.expiresAt) {
      return {
        isValid: false,
        message: 'Token expirado',
      };
    }

    await this.otpRepository.markAsUsed(otp.id);

    return {
      isValid: true,
      message: 'Token válido',
    };
  }
} 