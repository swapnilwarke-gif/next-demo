import { NextResponse } from "next/server"



export async function GET() {
  return NextResponse.json({ users: [
  ] })
}

export async function POST(request: NextRequest){
  try {
    const data = await request.json()

  } catch (error) {
   return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}