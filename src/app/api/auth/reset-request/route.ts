import { NextRequest } from "next/server";
import { handleResetRequest } from "@/lib/reset-request-handler";

export async function POST(request: NextRequest) {
  return handleResetRequest(request);
}
