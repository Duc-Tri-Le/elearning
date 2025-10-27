import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      user_id: number;
      email: string;
      role_id: number;
    };
  }
}
