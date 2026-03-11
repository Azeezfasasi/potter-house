import { authenticate, isAdmin } from "@/app/server/middleware/auth.js";
import User from "@/app/server/models/User.js";
import Programme from "@/app/server/models/Programme.js";
import ProgrammeRegistration from "@/app/server/models/ProgrammeRegistration.js";
import { Subscriber } from "@/app/server/models/Newsletter.js";
import { connectDB } from "@/app/server/db/connect.js";
import { NextResponse } from "next/server";

// GET /api/dashboard/stats
// Fetch aggregated statistics from all collections
export async function GET(req) {
  return authenticate(req, async () => {
    return isAdmin(req, async () => {
      try {
        await connectDB();

        // Fetch counts from all collections in parallel
        const [activeUsersCount, registrationsCount, programmesCount, adminsCount, subscribersCount] = await Promise.all([
          User.countDocuments({ isActive: true, role: { $ne: "admin" } }),
          ProgrammeRegistration.countDocuments(),
          Programme.countDocuments(),
          User.countDocuments({ role: "admin" }),
          Subscriber.countDocuments({ subscriptionStatus: "active" }),
        ]);

        const stats = {
          activeUsers: activeUsersCount,
          registrations: registrationsCount,
          programmes: programmesCount,
          admins: adminsCount,
          subscribers: subscribersCount,
        };

        return NextResponse.json(
          {
            success: true,
            stats,
            timestamp: new Date().toISOString(),
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
          },
          { status: 500 }
        );
      }
    });
  });
}
