import { z } from "zod";

export const registerDto = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  username: z.string().min(5, "Username must be at least 5 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long")
    .regex(
      /[A-Z]/,
      "Confirm password must contain at least one uppercase letter",
    )
    .regex(
      /[a-z]/,
      "Confirm password must contain at least one lowercase letter",
    )
    .regex(/[0-9]/, "Confirm password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Confirm password must contain at least one special character",
    ),
});

export const loginDto = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
