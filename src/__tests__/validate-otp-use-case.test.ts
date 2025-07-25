import { ValidateOTPUseCaseImpl } from "@/application/use-cases/validate-otp-use-case";
import { ValidateOTPRequestDTO } from "@/application/dtos/otp-dto";
import { OTPRepository } from "@/domain/repositories/otp-repository";
import { Otp } from "@/domain/entities/otp";
import { v4 as uuidv4 } from "uuid";

class MockOTPRepository implements OTPRepository {
  private otps: Otp[] = [];

  async create(otp: Otp): Promise<Otp> {
    this.otps.push(otp);
    return otp;
  }

  async findByToken(token: string): Promise<Otp | null> {
    return this.otps.find((otp) => otp.token === token) || null;
  }

  async markAsUsed(id: string): Promise<void> {
    const otp = this.otps.find((o) => o.id === id);
    if (otp) {
      otp.isUsed = true;
    }
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();
    this.otps = this.otps.filter((otp) => otp.expiresAt > now);
  }
}

describe("ValidateOTPUseCase", () => {
  let validateOTPUseCase: ValidateOTPUseCaseImpl;
  let mockRepository: MockOTPRepository;

  beforeEach(() => {
    mockRepository = new MockOTPRepository();
    validateOTPUseCase = new ValidateOTPUseCaseImpl(mockRepository);
  });

  describe("execute", () => {
    it("should validate a valid token", async () => {
      const validOTP: Otp = {
        id: uuidv4(),
        token: "123456",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 300000),
        isUsed: false,
      };
      await mockRepository.create(validOTP);

      const request: ValidateOTPRequestDTO = { token: "123456" };
      const result = await validateOTPUseCase.execute(request);

      expect(result.isValid).toBe(true);
      expect(result.message).toBe("Token válido");
    });

    it("should reject non-existent token", async () => {
      const request: ValidateOTPRequestDTO = { token: "999999" };
      const result = await validateOTPUseCase.execute(request);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Token não encontrado");
    });

    it("should reject already used token", async () => {
      const usedOTP: Otp = {
        id: uuidv4(),
        token: "123456",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 300000),
        isUsed: true,
      };
      await mockRepository.create(usedOTP);

      const request: ValidateOTPRequestDTO = { token: "123456" };
      const result = await validateOTPUseCase.execute(request);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Token já foi utilizado");
    });

    it("should reject expired token", async () => {
      const expiredOTP: Otp = {
        id: uuidv4(),
        token: "123456",
        createdAt: new Date(Date.now() - 600000),
        expiresAt: new Date(Date.now() - 300000),
        isUsed: false,
      };
      await mockRepository.create(expiredOTP);

      const request: ValidateOTPRequestDTO = { token: "123456" };
      const result = await validateOTPUseCase.execute(request);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Token expirado");
    });

    it("should mark token as used after successful validation", async () => {
      const validOTP: Otp = {
        id: uuidv4(),
        token: "123456",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 300000),
        isUsed: false,
      };
      await mockRepository.create(validOTP);

      const firstRequest: ValidateOTPRequestDTO = { token: "123456" };
      const firstResult = await validateOTPUseCase.execute(firstRequest);
      expect(firstResult.isValid).toBe(true);

      const secondRequest: ValidateOTPRequestDTO = { token: "123456" };
      const secondResult = await validateOTPUseCase.execute(secondRequest);
      expect(secondResult.isValid).toBe(false);
      expect(secondResult.message).toBe("Token já foi utilizado");
    });
  });
});
