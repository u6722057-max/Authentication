import jwt from "jsonwebtoken";
import { X_HEADER_USER_ID } from "./constant";

export function verifyJWT(request) {
  const secret = process.env.JWT_SECRET;
  const token = request.cookies.get("token")?.value;

  if (!secret || !token) return null;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Verify token failed:", error.message);
    return null;
  }
}

export function isAdmin(request) {
  return Number(request.headers.get(X_HEADER_USER_ID)) === -1;
}
