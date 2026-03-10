import { connectDB } from "@/app/server/db/connect.js";
import ProgrammeRegistration from "@/app/server/models/ProgrammeRegistration";
import { NextResponse } from "next/server";

// GET /api/programmes/registrations/[id] - Get single registration
export async function GET(req, { params }) {
  try {
    await connectDB();

    const registration = await ProgrammeRegistration.findById(params.id);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        registration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/programmes/registrations/[id] - Update registration status and notes
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();
    const { registrationStatus, notes } = body;

    if (!registrationStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration status is required",
        },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(registrationStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration status",
        },
        { status: 400 }
      );
    }

    const registration = await ProgrammeRegistration.findById(params.id);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    // Update status
    registration.registrationStatus = registrationStatus;

    // Update notes if provided
    if (notes) {
      registration.notes = notes;
    }

    // Update confirmedAt timestamp when status changes to confirmed
    if (registrationStatus === "confirmed" && !registration.confirmedAt) {
      registration.confirmedAt = new Date();
    }

    await registration.save();

    return NextResponse.json(
      {
        success: true,
        message: "Registration updated successfully",
        registration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/programmes/registrations/[id] - Delete registration
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const registration = await ProgrammeRegistration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
