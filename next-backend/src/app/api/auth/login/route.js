import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { errorResponse, printExceptionLog } from "@/lib/utils";

function checkAdmin(email, password) {
  if (email !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
    return null;
  }

  return { _id: "-1", email, username: "admin" };
}

async function checkUser(email, password) {
  const client = await getClientPromise();
  const user = await client.db(process.env.DB_NAME).collection("user").findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return null;
  return user;
}

function getJwtToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign(
    { id: String(user._id), email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return errorResponse("Missing email or password", 400);

    const user = checkAdmin(email, password) || await checkUser(email, password);
    if (!user) return errorResponse("Invalid email or password", 401);

    const response = NextResponse.json({ message: "Login successful" }, { headers: corsHeaders });
    response.cookies.set("token", getJwtToken(user), {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    printExceptionLog("Login", error);
    return errorResponse("Login service unavailable", 500);
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
