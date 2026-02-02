import { prisma } from "@/src/config/database";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { signJwt } from "@/src/app/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email And Passwrod is compulsory fields",
        },
        {
          status: 400,
        },
      );
    }
    const userDetail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    if (!userDetail) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        {
          status: 400,
        },
      );
    }
    const hashedPassword = userDetail?.password ?? "";
    const passwordCorrect = await compare(password, hashedPassword);

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Provided Password is wrong",
        },
        {
          status: 400,
        },
      );
    }
    const userData = {
      id: userDetail?.id,
      name: userDetail?.name,
      email: userDetail?.email,
      role: userDetail?.role,
    };
    const token = signJwt({
      id: userDetail?.id,
      name: userDetail?.name,
      email: userDetail?.email,
      role: userDetail?.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login Succesfully",
        data: [{ ...userData, token }],
      },
      {
        status: 200,
      },
    );
    response.cookies.set("token",token,{
      httpOnly: true
    })
    return response
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
