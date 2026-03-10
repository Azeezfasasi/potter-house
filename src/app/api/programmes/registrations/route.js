import { connectDB } from "@/app/server/db/connect.js";
import ProgrammeRegistration from "@/app/server/models/ProgrammeRegistration";
import { NextResponse } from "next/server";

// GET /api/programmes/registrations - Get all programme registrations with filters
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const programmeName = searchParams.get("programmeName");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (status) {
      query.registrationStatus = status;
    }

    if (programmeName) {
      query.programmeName = programmeName;
    }

    const registrations = await ProgrammeRegistration.find(query)
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await ProgrammeRegistration.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        success: true,
        registrations,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all registrations error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
