/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Pusher from "pusher"

// Create the server-side pusher instance
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true
});

export async function placeBid(auctionId: number, bidderName: string, amount: number) {
    // 1. Database Logic
    const result = await prisma.$transaction(async (tx) => {
        const auction = await tx.auction.findUnique({ where: { id: auctionId } });
        if (!auction || amount <= Number(auction.currentBid)) throw new Error("Bid too low");

        await tx.auction.update({ where: { id: auctionId }, data: { currentBid: amount } });
        return await tx.bid.create({ data: { amount, bidderName, auctionId } });
    });

    // 2. CRITICAL: Await the Pusher Trigger
    // This sends the data to Browser 1
    console.log(`Triggering Pusher for auction-${auctionId}`);

    await pusher.trigger(`auction-${auctionId}`, "new-bid", {
        amount: amount,
        bidderName: bidderName,
        time: new Date()
    });

    return { success: true };
}


export async function createAuction(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startPrice = parseFloat(formData.get("startPrice") as string);
    const endTimeInput = formData.get("endTime") as string;

    // Convert HTML datetime-local string to JS Date
    const endTime = new Date(endTimeInput);

    await prisma.auction.create({
        data: {
            title,
            description,
            startPrice,
            currentBid: startPrice, // Initially, current bid is the start price
            endTime,
        }
    });

    // Clear the homepage cache so the new auction appears immediately
    revalidatePath("/");
    redirect("/");
}

// export async function placeBid(auctionId: number, bidderName: string, amount: number) {
//     return await prisma.$transaction(async (tx) => {
//         // 1. Get current auction state
//         const auction = await tx.auction.findUnique({ where: { id: auctionId } });

//         if (!auction || amount <= Number(auction.currentBid)) {
//             throw new Error("Bid must be higher than current bid");
//         }

//         // 2. Update Auction & Create Bid
//         const updatedAuction = await tx.auction.update({
//             where: { id: auctionId },
//             data: { currentBid: amount }
//         });

//         const newBid = await tx.bid.create({
//             data: { amount, bidderName, auctionId }
//         });

//         // 3. TRIGGER REAL-TIME UPDATE
//         // This sends the new bid to all browsers watching this auction
//         await pusher.trigger(`auction-${auctionId}`, "new-bid", {
//             amount: amount,
//             bidderName: bidderName,
//             time: new Date()
//         });

//         return { success: true };
//     });
// }

export async function getAuction(id: number) {
    const data = await prisma.auction.findUnique({
        where: { id },
        include: { bids: { orderBy: { createdAt: 'desc' }, take: 10 } }
    });

    if (!data) return null;

    // Clean decimals for Next.js
    return {
        ...data,
        currentBid: Number(data.currentBid),
        startPrice: Number(data.startPrice),
        bids: data.bids.map(b => ({ ...b, amount: Number(b.amount) }))
    };
}