import { connectDB } from "@/app/server/db/connect.js";
import User from "@/app/server/models/User";
import { NextResponse } from "next/server";

// POST /api/auth/get-next-believer-id-sequence
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { state, country } = body;

    if (!state || !country) {
      return NextResponse.json(
        {
          success: false,
          message: "State and Country are required",
        },
        { status: 400 }
      );
    }

    // Count existing believer IDs for this state/country combination
    // Believer IDs follow format: [State2Chars][Country2Chars]LS[6-digit number]
    const stateCode = state.substring(0, 2).toUpperCase();
    const countryCode = country.substring(0, 2).toUpperCase();
    const idPattern = `^${stateCode}${countryCode}LS`;

    // Find all believer IDs matching this pattern
    const existingIds = await User.find({
      believerID: new RegExp(idPattern),
    }).select("believerID");

    // Extract sequence numbers and find the highest one
    let maxSequence = 0;

    if (existingIds.length > 0) {
      existingIds.forEach((user) => {
        // Extract the 6-digit sequence from the believer ID
        // Format: [2-char state][2-char country]LS[6-digit sequence]
        const sequenceStr = user.believerID.substring(6); // Get everything after "??LS"
        const sequence = parseInt(sequenceStr, 10);
        if (!isNaN(sequence) && sequence > maxSequence) {
          maxSequence = sequence;
        }
      });
    }

    // Next sequence number
    const nextSequence = maxSequence + 1;

    if (nextSequence > 999999) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum believer IDs for this state/country combination reached",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        sequenceNumber: nextSequence,
        stateCode,
        countryCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get next believer ID sequence error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate next believer ID sequence",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
