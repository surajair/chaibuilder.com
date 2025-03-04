import { NextResponse } from "next/server";

export async function GET() {
  try {
    const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
    const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;

    if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Uploadcare credentials not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.uploadcare.com/files/", {
      headers: {
        Accept: "application/vnd.uploadcare-v0.7+json",
        Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files from Uploadcare" },
      { status: 500 }
    );
  }
}
