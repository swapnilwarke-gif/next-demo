import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const JWT_SECRET: string = process.env?.JWT_SECRET || "backup-secret-key";

export async function proxy(request: NextRequest) {
  try {
    // const data = await request.json()
    // const [bearer,token] =

    // const pathname = request.nextUrl.pathname;
    // console.log(pathname);

    const token = request.cookies.get("token")?.value;

    // Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    // const token = authHeader?.startsWith("Bearer ")
    //   ? authHeader.split(" ")[1]
    //   : null;
    // const token : string = authHeader?.value || ''

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 },
      );
    }
    const jwtVerify: any = jwt.verify(token, JWT_SECRET);
    if (!jwtVerify) {
      return NextResponse.json(
        { success: false, message: "not authorized" },
        { status: 401 },
      );
    }
    // request.user = jwtVerify;
    // because we want have functionality like req.user so we have to use below method
    const requestHeaders = new Headers(request?.headers);
    requestHeaders.set("x-user", JSON.stringify(jwtVerify));
    return NextResponse.next(
      {
        request: {
          headers: requestHeaders
        }
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
  ],
};
