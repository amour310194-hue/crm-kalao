import { NextRequest } from "next/server";
import { tiktokPost } from "../channel-post";

export function POST(request: NextRequest) {
  return tiktokPost(request);
}
