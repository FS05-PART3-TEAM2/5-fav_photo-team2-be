import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(9),
  nickname: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(9),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
