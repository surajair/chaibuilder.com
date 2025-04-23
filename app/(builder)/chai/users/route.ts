import { chaiBuilderPages } from "@/chai";
import "@/data";
import "@/page-types";
import { has } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  try {
    const authorization = req.headers.get("authorization");
    const authToken = authorization ? authorization.split(" ")[1] : "";
    const response = await chaiBuilderPages.handle(requestBody, authToken);
    console.log("requestBody", requestBody, response);
    if (has(response, "error")) {
      return NextResponse.json(response, { status: response.status });
    }
    return NextResponse.json(response);
  } catch (error) {
    console.log("error", error);
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
