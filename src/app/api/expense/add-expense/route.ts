import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/config/database";

export async function POST(request: Request) {
  try {
    interface inputData {
      expense_type: string;
      sub_expense_type: string;
      amount: number;
      description: string;
      expense_date: string;
    }
    const data : inputData = await request.json();
    const {
      expense_type,
      sub_expense_type,
      amount,
      description,
      expense_date,
    } = data;
    if (
      !expense_type ||
      !sub_expense_type ||
      !amount ||
      !description ||
      !expense_date
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide proper fields to add expense",
          data: [],
        },

        {
          status: 400,
        },
      );
    }

    const expenseDetail = await prisma.expense.create({
      data: {
        expense_type,
        sub_expense_type,
        amount,
        description,
        expense_date,
      },
      select: {
        expense_type: true,
        sub_expense_type: true,
        amount: true,
        description: true,
        expense_date: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Expense Added", data: expenseDetail },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error?.message);``
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
