export class Otp {
  constructor(
    public id: string,
    public token: string,
    public createdAt: Date,
    public expiresAt: Date,
    public isUsed: boolean
  ) {}
} 