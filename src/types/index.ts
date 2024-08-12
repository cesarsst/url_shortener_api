export type UserTokenDecoded = {
  userId: number;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: UserTokenDecoded;
  }
}
