import { OTPRepository } from '@/domain/repositories/otp-repository';
import { CreateOTPRequestDTO, CreateOTPResponseDTO } from '@/application/dtos/otp-dto';
import { Otp } from '@/domain/entities/otp';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOTPUseCase {
  execute(request: CreateOTPRequestDTO): Promise<CreateOTPResponseDTO>;
}

export class CreateOTPUseCaseImpl implements CreateOTPUseCase {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly expirationTime: number,
    private readonly tokenLength: number
  ) {}

  async execute(request: CreateOTPRequestDTO): Promise<CreateOTPResponseDTO> {
    const token = this.generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.expirationTime);

    const otp: Otp = {
      id: uuidv4(),
      token,
      createdAt: now,
      expiresAt,
      isUsed: false,
    };

    await this.otpRepository.create(otp);

    return { token };
  }

  private generateToken(): string {
    const digits = '0123456789';
    let token = '';
    
    for (let i = 0; i < this.tokenLength; i++) {
      token += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return token;
  }
} 