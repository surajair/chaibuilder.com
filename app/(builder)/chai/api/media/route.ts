// route handler with secret and slug

import { chaiBuilderPages } from "@/chai";
import { ChaiBuilderPagesUserManagement } from "@chaibuilder/pages/server";
import { isEmpty } from "lodash";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check for `authorization` header
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const userManagement = new ChaiBuilderPagesUserManagement();
    chaiBuilderPages.setUserManagement(userManagement);

    // Check and extract, valid token string `authorization`
    const token = authorization ? authorization.split(" ")[1] : undefined;
    const user = await userManagement.verifyTokenAndGetUser(token as string);

    if (isEmpty(user?.id)) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const response: unknown = [];
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
