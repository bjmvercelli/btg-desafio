import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createOTPSchema = Joi.object({
  userId: Joi.string().optional(),
});

const validateOTPSchema = Joi.object({
  token: Joi.string().required().length(6).pattern(/^\d+$/),
});

export const validateCreateOTP = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = createOTPSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      error: error.details[0]?.message,
    });
    return;
  }
  
  next();
};

export const validateOTP = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = validateOTPSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Token inválido',
      error: error.details[0]?.message,
    });
    return;
  }
  
  next();
}; 