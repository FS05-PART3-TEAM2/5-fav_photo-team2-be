import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        email?: string;
        nickname?: string;
      };
    }
  }
}

export {};
