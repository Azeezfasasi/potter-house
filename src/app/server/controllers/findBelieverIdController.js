import { NextResponse } from "next/server";
import User from "../models/User.js";
import { connectDB } from "../db/connect.js";

// Find Believer ID by personal details
export const findBelieverID = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const { dateOfBirth, phoneNumber, email } = body;

    // Validation
    if (!dateOfBirth || !phoneNumber || !email) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert dateOfBirth to Date object
    const dobDate = new Date(dateOfBirth);

    // Find user by dateOfBirth, phone, and email
    const user = await User.findOne({
      dateOfBirth: {
        $gte: new Date(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate()),
        $lt: new Date(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate() + 1),
      },
      $or: [
        { phoneNumber: phoneNumber.replace(/\s+/g, '') },
        { phone: phoneNumber.replace(/\s+/g, '') }
      ],
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No user found with the provided details. Please check and try again.",
        },
        { status: 404 }
      );
    }

    if (!user.believerID) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account does not have a Believer ID assigned yet. Please contact support.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        believerID: user.believerID,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          believerCategory: user.believerCategory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Find Believer ID error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to find Believer ID",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
