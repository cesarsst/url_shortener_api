export type UserTokenDecoded = {
  userId: number;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: UserTokenDecoded; // Torne a propriedade opcional para garantir que a tipagem seja segura
  }
}
