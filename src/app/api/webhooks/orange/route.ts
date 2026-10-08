import { NextRequest } from "next/server";
import { orangePost } from "../channel-post";

export function POST(request: NextRequest) {
  return orangePost(request);
}
