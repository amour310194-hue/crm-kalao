import { NextRequest } from "next/server";
import { handleResetConfirm } from "@/lib/reset-confirm-handler";

export async function POST(request: NextRequest) {
  return handleResetConfirm(request);
}
