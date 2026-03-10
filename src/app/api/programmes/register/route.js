import { connectDB } from "@/app/server/db/connect.js";
import User from "@/app/server/models/User";
import ProgrammeRegistration from "@/app/server/models/ProgrammeRegistration";
import { NextResponse } from "next/server";

// POST /api/programmes/register
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      believerID,
      firstName,
      lastName,
      email,
      phoneNumber,
      programmeName,
      programmeStartDate,
      programmeEndDate,
      programmeDuration,
      attendanceMode,
      emergencyContactName,
      emergencyContactPhone,
      specialRequirements,
      agreeToTerms,
    } = body;

    // Validation
    if (
      !believerID ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !programmeName ||
      !programmeStartDate ||
      !attendanceMode ||
      !emergencyContactName ||
      !emergencyContactPhone
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        {
          success: false,
          message: "You must agree to terms and conditions",
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
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user already registered for this programme
    const existingRegistration = await ProgrammeRegistration.findOne({
      userId: user._id,
      programmeName: programmeName,
    });

    if (existingRegistration && existingRegistration.registrationStatus !== "cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: "You are already registered for this programme",
        },
        { status: 409 }
      );
    }

    // Create programme registration
    const registration = new ProgrammeRegistration({
      userId: user._id,
      believerID: believerID.toUpperCase(),
      firstName,
      lastName,
      email,
      phoneNumber,
      programmeName,
      programmeStartDate: new Date(programmeStartDate),
      programmeEndDate: programmeEndDate ? new Date(programmeEndDate) : null,
      programmeDuration,
      attendanceMode,
      emergencyContactName,
      emergencyContactPhone,
      specialRequirements,
      agreeToTerms,
      registrationStatus: "pending",
    });

    await registration.save();

    return NextResponse.json(
      {
        success: true,
        message: "Programme registration submitted successfully!",
        registration: {
          id: registration._id,
          programmeName: registration.programmeName,
          status: registration.registrationStatus,
          registeredAt: registration.registeredAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Programme registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit programme registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/programmes/register?userId=xxxxx
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const believerID = searchParams.get("believerID");

    if (!userId && !believerID) {
      return NextResponse.json(
        {
          success: false,
          message: "userId or believerID is required",
        },
        { status: 400 }
      );
    }

    let query = {};
    if (userId) {
      query.userId = userId;
    } else if (believerID) {
      query.believerID = believerID.toUpperCase();
    }

    const registrations = await ProgrammeRegistration.find(query).sort({
      registeredAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        registrations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get registrations error:", error);
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
