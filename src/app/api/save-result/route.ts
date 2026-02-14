import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const results = formData.get("results") as string;
        const mode = formData.get("mode") as string;

        if (!file || !results || !mode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: "public",
        });

        // Save to Database
        const analysis = await prisma.analysis.create({
            data: {
                userId: session.user.id!,
                imageUrl: blob.url,
                results: JSON.parse(results),
                mode: mode,
            },
        });

        return NextResponse.json({ success: true, analysisId: analysis.id });
    } catch (error) {
        console.error("Error saving result:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
