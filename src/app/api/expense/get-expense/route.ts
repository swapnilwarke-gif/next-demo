// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request?.url);
//     let params: any = {};
//     searchParams.forEach((value, key) => {
//       if (key == "page" || key == "limit") {
//         params[key] = value;
//       }
//       params[key] = value;
//     });
//     let whereClause: any = {};
//     if (params.search) {
//       whereClause["OR"] = [
//         {
//           expense_type: { contains: params.search, mode: "insensitive" },
//         },
//         {
//           sub_expense_type: { contains: params.search, mode: "insensitive" },
//         },
//       ];
//     }

//     if (params.month && params.year) {
//       const startDate = new Date(params.year, params.month - 1, 1);
//       const endDate = new Date(params.year, params.month, 1);
//       whereClause["expense_date"] = {
//         gte: startDate,
//         lt: endDate,
//       };
//     }

//     if (params.year && !params.month) {
//       const endDate = new Date(params.year + 1, 0, 1);
//       const startDate = new Date(params.year, 0, 1);
//       whereClause["expense_date"] = {
//         AND: [
//           {
//             gte: startDate,
//             lt: endDate,
//           },
//         ],
//       };
//     }
//     const expense = await prisma.expense.findMany({
//       take: Number(params?.limit),
//       skip: Number(params?.page) - 1,
//       where: whereClause,
//     });
//     return NextResponse.json(
//       { success: true, message: "Expense Fetched", data: expense },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/config/database";

interface ExpenseQueryParams {
  page: number;
  limit: number;
  search?: string;
  month?: number;
  year?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseParams(searchParams);
    const where = buildWhereClause(params);

    const expenses = await prisma.expense.findMany({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      where,
      select: {
        id: true,
        amount: true,
        description: true,
        expense_date: true,
        expense_type: true,
        sub_expense_type: true,

        sub_expense: {
          select: {
            id: true,
            expense_type: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Expenses fetched", data: expenses },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

function parseParams(searchParams: URLSearchParams): ExpenseQueryParams {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") ?? undefined;
  const month = searchParams.has("month")
    ? Number(searchParams.get("month"))
    : undefined;
  const year = searchParams.has("year")
    ? Number(searchParams.get("year"))
    : undefined;

  return { page, limit, search, month, year };
}

function buildWhereClause(params: ExpenseQueryParams) {
  const where: Record<string, unknown> = {};

  if (params.search) {
    where["OR"] = [
      { expense_type: { contains: params.search, mode: "insensitive" } },
      { sub_expense_type: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.year && params.month) {
    where["expense_date"] = {
      gte: new Date(params.year, params.month - 1, 1),
      lt: new Date(params.year, params.month, 1),
    };
  } else if (params.year) {
    where["expense_date"] = {
      gte: new Date(params.year, 0, 1),
      lt: new Date(params.year + 1, 0, 1),
    };
  }

  return where;
}
