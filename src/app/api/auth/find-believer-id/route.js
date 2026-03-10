import { findBelieverID } from "@/app/server/controllers/findBelieverIdController.js";

// POST /api/auth/find-believer-id
export async function POST(req) {
  return findBelieverID(req);
}
