/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState, use } from 'react'; // 1. Import 'use'
import Pusher from 'pusher-js';
import { getAuction, placeBid } from '../../actions';

// 2. Define the type for params as a Promise
// interface PageProps {
//     params: Promise<{ id: string }>;
// }

// export default function AuctionPage({ params }: PageProps) {
//     // 3. Unwrap the params using React.use()
//     const resolvedParams = use(params);
//     const id = resolvedParams.id;

//     const [auction, setAuction] = useState<any>(null);
//     const [bidAmount, setBidAmount] = useState(0);
//     const [name, setName] = useState("");

//     useEffect(() => {
//         // Use the unwrapped 'id' here
//         getAuction(Number(id)).then(setAuction);

//         const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
//             cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//         });

//         const channel = pusher.subscribe(`auction-${id}`);

//         channel.bind('new-bid', (data: any) => {
//             setAuction((prev: any) => ({
//                 ...prev,
//                 currentBid: data.amount,
//                 bids: [{ amount: data.amount, bidderName: data.bidderName, createdAt: data.time }, ...prev.bids]
//             }));
//         });

//         return () => pusher.unsubscribe(`auction-${id}`);
//     }, [id]); // 4. Update dependency array to use unwrapped 'id'

export default function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap Next 15 params
    const [auction, setAuction] = useState<any>(null);

    const [bidAmount, setBidAmount] = useState(0);
    const [name, setName] = useState("");

    // 1. Initial Load
    useEffect(() => {
        getAuction(Number(id)).then(setAuction);
    }, [id]);

    // 2. Real-time Subscription
    useEffect(() => {
        if (!id) return;

        // Initialize Pusher
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channelName = `auction-${id}`;
        const channel = pusher.subscribe(channelName);

        console.log(`📡 Browser 1 subscribing to: ${channelName}`);

        // Listen for the event
        channel.bind('new-bid', (data: any) => {
            console.log("🔥 REAL-TIME EVENT RECEIVED!", data);

            setAuction((prev: any) => ({
                ...prev,
                currentBid: data.amount,
                bids: [
                    { amount: data.amount, bidderName: data.bidderName, createdAt: data.time },
                    ...(prev?.bids || [])
                ]
            }));
        });

        // Handle connection errors
        pusher.connection.bind('error', (err: any) => console.error('Pusher Error:', err));

        return () => {
            console.log("🔌 Unsubscribing...");
            pusher.unsubscribe(channelName);
            pusher.disconnect();
        };
    }, [id]); // Only re-run if ID changes

    const submitBid = async () => {
        try {
            await placeBid(Number(id), name, bidAmount);
            alert("Bid placed!");
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (!auction) return <p className="p-10 text-center">Loading Auction...</p>;

    return (
        <div className="max-w-4xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* ... (rest of your UI code remains the same) ... */}
            <div>
                <h1 className="text-4xl font-bold">{auction.title}</h1>
                <p className="text-gray-500 mt-2">{auction.description}</p>
                <div className="mt-8 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                    <span className="text-gray-600 uppercase text-sm font-bold">Current Bid</span>
                    <div className="text-5xl font-black text-blue-700">${auction.currentBid}</div>
                </div>
                <div className="mt-6 space-y-4">
                    <input className="w-full p-3 border rounded" placeholder="Your Name" onChange={e => setName(e.target.value)} />
                    <input className="w-full p-3 border rounded" type="number" placeholder="Bid Amount" onChange={e => setBidAmount(Number(e.target.value))} />
                    <button onClick={submitBid} className="w-full bg-black text-white p-4 rounded-lg font-bold hover:bg-gray-800 transition">
                        Place Bid
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-bold border-b pb-2 mb-4">Recent Bids</h3>
                <div className="space-y-3">
                    {auction.bids?.map((bid: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                            <span className="font-medium">{bid.bidderName}</span>
                            <span className="font-bold text-green-600">${bid.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}