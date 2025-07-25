export interface CreateOTPRequestDTO {
  userId?: string;
}

export interface CreateOTPResponseDTO {
  token: string;
}

export interface ValidateOTPRequestDTO {
  token: string;
}

export interface ValidateOTPResponseDTO {
  isValid: boolean;
  message: string;
} 