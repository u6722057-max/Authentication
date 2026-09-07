import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export function GET() {
  const response = NextResponse.json({ message: "Logout successful" }, { headers: corsHeaders });
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
