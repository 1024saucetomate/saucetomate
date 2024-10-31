import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/utils/prisma";

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vote = await prisma.vote.findUnique({
      where: { id: params.id },
    });

    if (!vote) {
      return NextResponse.json(
        {
          code: HTTP_STATUS.NOT_FOUND,
          message: "Vote not found",
        },
        { status: HTTP_STATUS.NOT_FOUND },
      );
    }

    return NextResponse.json({
      code: HTTP_STATUS.OK,
      message: "Success",
      data: vote,
    });
  } catch {
    return NextResponse.json(
      {
        code: HTTP_STATUS.SERVER_ERROR,
        message: "Internal server error",
      },
      { status: HTTP_STATUS.SERVER_ERROR },
    );
  }
}
