import { NextResponse } from "next/server";
import { ErrorCodeType } from "./errors";

export function apiSuccess<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function apiError(code: ErrorCodeType, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}
