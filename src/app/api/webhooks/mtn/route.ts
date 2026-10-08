import { NextRequest } from "next/server";
import { mtnPost } from "../channel-post";

export function POST(request: NextRequest) {
  return mtnPost(request);
}
