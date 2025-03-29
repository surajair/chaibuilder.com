import { chaiBuilderPages } from "@/chai";
import "@/data";
import "@/page-types";
import { ChaiBuilderPagesUserManagement } from "@chaibuilder/pages/server";
import { get, isEmpty } from "lodash";
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

    const auth = new ChaiBuilderPagesUserManagement();

    // Check and extract, valid token string `authorization`
    const token = authorization ? authorization.split(" ")[1] : undefined;
    const user = await auth.verifyTokenAndGetUser(token as string);

    if (isEmpty(user.id)) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    chaiBuilderPages.setUserManagement(auth);
    const response = await chaiBuilderPages.handle(requestBody, user.id);
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
