import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/vote/")) {
    const voteId = request.nextUrl.pathname.split("/")[2];
    try {
      await axios.get(`${request.nextUrl.origin}/api/vote/${voteId}`);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(`${request.nextUrl.origin}/404`);
    }
  }
}
