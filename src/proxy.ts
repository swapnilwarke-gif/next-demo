import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
const JWT_SECRET: string = process.env?.JWT_SECRET || "backup-secret-key";

export async function proxy(request: NextRequest) {
  try {
    // const data = await request.json()
    // const [bearer,token] =

    // const pathname = request.nextUrl.pathname;
    // console.log(pathname);

    const authHeader = request.headers.get("authorization");
    console.log(authHeader);

    // Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 },
      );
    }
    const jwtVerify : any = jwt.verify(token,JWT_SECRET)
    if(!jwtVerify){
      return NextResponse.json({ success: false, message: "not authorized" },{status: 401});

    }
    request.user = jwtVerify
    return NextResponse.next();
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
