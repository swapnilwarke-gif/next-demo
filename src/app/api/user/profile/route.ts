import { prisma } from "@/src/config/database";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ users: [] });
  } catch (error) {}
}

export async function POST(request: NextRequest) {
  try {
    //   const headers = Object.fromEntries(request.headers.entries());

    // const { id: userId } = await params;
    const middlewareValue: string = request.headers.get("x-user") || "";
    if (!middlewareValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Token Value not found",
        },
        { status: 400 },
      );
    }
    const userTokenDetails = JSON.parse(middlewareValue);

    const useDetails = await prisma.user.findUnique({
      where: {
        id: userTokenDetails?.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!useDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile Details for this user does not exists",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Profile Data fetched succesfully",
        data: useDetails,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
