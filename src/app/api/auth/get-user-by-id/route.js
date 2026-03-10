import { connectDB } from "@/app/server/db/connect.js";
import User from "@/app/server/models/User";
import { NextResponse } from "next/server";

// GET /api/auth/get-user-by-id?believerID=xxxxx
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const believerID = searchParams.get("believerID");

    if (!believerID) {
      return NextResponse.json(
        {
          success: false,
          message: "Believer ID is required",
        },
        { status: 400 }
      );
    }

    // Find user by believerID
    const user = await User.findOne({ believerID: believerID.toUpperCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found with this Believer ID",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: user.getPublicProfile(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
