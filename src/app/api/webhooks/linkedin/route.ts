import { NextRequest } from "next/server";
import { linkedinPost } from "../channel-post";

export function POST(request: NextRequest) {
  return linkedinPost(request);
}
