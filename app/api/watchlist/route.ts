import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const watchlist = await prisma.watchlist.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(watchlist);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { mediaId, mediaType, title, poster } = await request.json();

    const existing = await prisma.watchlist.findFirst({
        where: { userId: user.id, mediaId, mediaType },
    });
    if (existing) return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });

    const item = await prisma.watchlist.create({
        data: { userId: user.id, mediaId, mediaType, title, poster },
    });
    return NextResponse.json(item);
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { mediaId, mediaType } = await request.json();

    await prisma.watchlist.deleteMany({
        where: { userId: user.id, mediaId, mediaType },
    });
    return NextResponse.json({ success: true });
}