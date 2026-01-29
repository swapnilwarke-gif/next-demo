import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/config/database";
import { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isUserExist = await prisma.user.count({
      where: {
        email: body?.email,
      },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          success: false,
          message: "user with this email already exists",
          data: [],
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await hash(body?.password, 10);
    const user = await prisma.user.create({
      data: {
        email: body?.email,
        name: body?.name,
        role: body?.role,
        password: hashedPassword,
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_deleted: true,
      },
    });

    // const abc = websocketService.getConnectedClientsCount();
    // console.log(abc);
    return NextResponse.json(
      { success: true, message: "User created succesfully", data: user },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
