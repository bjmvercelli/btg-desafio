import { Otp } from '@/domain/entities/otp';

export interface OTPRepository {
  create(otp: Otp): Promise<Otp>;
  findByToken(token: string): Promise<Otp | null>;
  markAsUsed(id: string): Promise<void>;
  deleteExpired(): Promise<void>;
} 