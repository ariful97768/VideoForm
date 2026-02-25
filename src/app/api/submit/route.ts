import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required data
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Add server-side timestamp
    const submission = {
      ...body,
      submittedAt: new Date(),
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Save to MongoDB
    const db = await getDatabase();
    const result = await db.collection("submissions").insertOne(submission);

    // Optional: Send email notification (implement as needed)
    // await sendEmailNotification(submission);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId.toString(),
        message: "Form submitted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Optional: GET endpoint to retrieve submissions (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    const db = await getDatabase();

    if (sessionId) {
      // Get specific submission by session ID
      const submission = await db
        .collection("submissions")
        .findOne({ sessionId });

      if (!submission) {
        return NextResponse.json(
          { error: "Submission not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ submission }, { status: 200 });
    } else {
      // Get recent submissions (limit to 50)
      const submissions = await db
        .collection("submissions")
        .find()
        .sort({ submittedAt: -1 })
        .limit(50)
        .toArray();

      return NextResponse.json({ submissions }, { status: 200 });
    }
  } catch (error) {
    console.error("Error retrieving submissions:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
