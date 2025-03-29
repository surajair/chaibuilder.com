import { verifyIdToken } from "@/app/(chaibuilder)/chai/api/auth";
import { chaiBuilderPages } from "@/chai";
import "@/data";
import "@/page-types";
import { get } from "lodash";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  try {
    // Check for `authorization` header
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // Check and extract, valid token string `authorization`
    const token = authorization ? authorization.split(" ")[1] : null;
    if (!token) {
      return NextResponse.json(
        { error: "Invalid Authorization header format" },
        { status: 401 }
      );
    }

    // * Validate user access token using firebase admin auth
    const decodedUser = await verifyIdToken(token);
    if (!decodedUser) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const response = await chaiBuilderPages.handle(requestBody, decodedUser.id);
    const tags = get(response, "tags", []);

    for (const tag of tags) {
      revalidateTag(tag);
    }

    if ("error" in response) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    // * On error, throw if firebase auth error, else 500
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }
}
