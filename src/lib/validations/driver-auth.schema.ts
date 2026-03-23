import { z } from 'zod';

export const driverLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const driverRegisterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      'Invalid phone number format'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const guestDriverSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  firstName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      'First name must be at least 2 characters if provided'
    ),
});

export const updateDriverProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      'Invalid phone number format'
    ),
});

export const addRfidCardSchema = z.object({
  idTag: z
    .string()
    .min(1, 'RFID tag is required')
    .min(4, 'RFID tag must be at least 4 characters'),
  visualNumber: z.string().optional(),
});

export const startChargingSchema = z.object({
  stationId: z.string().min(1, 'Station ID is required'),
  connectorId: z.number().min(1, 'Connector ID must be at least 1'),
});

export type DriverLoginInput = z.infer<typeof driverLoginSchema>;
export type DriverRegisterInput = z.infer<typeof driverRegisterSchema>;
export type GuestDriverInput = z.infer<typeof guestDriverSchema>;
export type UpdateDriverProfileInput = z.infer<typeof updateDriverProfileSchema>;
export type AddRfidCardInput = z.infer<typeof addRfidCardSchema>;
export type StartChargingInput = z.infer<typeof startChargingSchema>;
