import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env?.JWT_SECRET || "backup-secret-key";
const expireIn: string = process.env?.expireIn || "1d";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const signJwt = (userData: UserData) => {
  const tokenPayload: TokenPayload = userData;
  const token: string = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: expireIn,
  } as any);

  return token;
};
