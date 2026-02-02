import { prisma } from "@/src/config/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, description } = body;
    if (!type || !description) {
      return NextResponse.json(
        { success: false, message: "type and description is needed" },
        { status: 400 },
      );
    }

    const subExpense = await prisma.subExpenseType.create({
      data: {
        expense_type: type,
        description,
        createdAt: new Date(),
        is_deleted: false,
      },
      select: {
        id: true,
        expense_type: true,
        description: true,
        createdAt: true,
      },
    });
    return NextResponse.json(
      {
        success: false,
        message: "Sub Expense Added Successfully",
        data: {
          id: subExpense.id,
          type: subExpense.expense_type, // alias here
          description: subExpense.description,
          createdAt: subExpense.createdAt,
        },
      },
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

export async function GET(request:Request){
  try {
    const subExpenseDetails = await prisma.subExpenseType.findMany({
      select: {
          id: true,
          expense_type: true,
      }
    })

    return NextResponse.json(
        {
          success: true,
          message: "SubExpense Fetched Successfully",
          data:  subExpenseDetails
        },
        { status: 200 },
      );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}