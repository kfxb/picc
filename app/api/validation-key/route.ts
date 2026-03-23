import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    "aca1a4d64575589152329b6e9e167fca020d2e46079d4a00509b9e3dfb2dea4d549509abff8ce16778fca348f23b6d07bad58bc49eb08b6c2f53b2567fc922ed",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
