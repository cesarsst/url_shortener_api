declare global {
  namespace Express {
    interface Request {
      user: UserTokenDecoded;
    }
  }
}

export type UserTokenDecoded = {
  userId: number;
  email: string;
};
