import { CreateOTPUseCaseImpl } from "@/application/use-cases/create-otp-use-case";
import { CreateOTPRequestDTO } from "@/application/dtos/otp-dto";
import { OTPRepository } from "@/domain/repositories/otp-repository";
import { Otp } from "@/domain/entities/otp";

class MockOTPRepository implements OTPRepository {
  private otps: Otp[] = [];

  async create(otp: Otp): Promise<Otp> {
    this.otps.push(otp);
    return otp;
  }

  async findByToken(token: string): Promise<Otp | null> {
    return this.otps.find(otp => otp.token === token) || null;
  }

  async markAsUsed(id: string): Promise<void> {
    const otp = this.otps.find(o => o.id === id);
    if (otp) {
      otp.isUsed = true;
    }
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();
    this.otps = this.otps.filter(otp => otp.expiresAt > now);
  }
}

describe("CreateOTPUseCase", () => {
  let createOTPUseCase: CreateOTPUseCaseImpl;
  let mockRepository: MockOTPRepository;

  beforeEach(() => {
    mockRepository = new MockOTPRepository();
    createOTPUseCase = new CreateOTPUseCaseImpl(mockRepository, 300000, 6);
  });

  describe("execute", () => {
    it("should create a new OTP with valid token", async () => {
      const request: CreateOTPRequestDTO = { userId: "user123" };
      const result = await createOTPUseCase.execute(request);

      expect(result.token).toBeDefined();
      expect(result.token).toHaveLength(6);
      expect(result.token).toMatch(/^\d{6}$/);
    });

    it("should create OTP with custom expiration time", async () => {
      const customUseCase = new CreateOTPUseCaseImpl(mockRepository, 60000, 6);
      const request: CreateOTPRequestDTO = {};
      const result = await customUseCase.execute(request);

      expect(result.token).toBeDefined();
    });

    it("should create OTP with custom token length", async () => {
      const customUseCase = new CreateOTPUseCaseImpl(mockRepository, 300000, 8);
      const request: CreateOTPRequestDTO = {};
      const result = await customUseCase.execute(request);

      expect(result.token).toHaveLength(8);
    });

    it("should persist OTP in repository", async () => {
      const request: CreateOTPRequestDTO = { userId: "user123" };
      const result = await createOTPUseCase.execute(request);
      
      const savedOTP = await mockRepository.findByToken(result.token);
      expect(savedOTP).toBeDefined();
      expect(savedOTP?.token).toBe(result.token);
      expect(savedOTP?.isUsed).toBe(false);
    });
  });
}); 