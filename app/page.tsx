import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  // 1. Fetch auctions from SQL Server
  const auctions = await prisma.auction.findMany({
    orderBy: { endTime: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Live Auctions
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time bidding powered by SQL Server & Pusher.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-blue-800 font-bold text-sm">
            {auctions.length} Items Live
          </span>
        </div>
      </div>

      {/* Auction Grid */}
      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {auction.title}
                </h2>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {auction.description}
                </p>

                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                    Current High Bid
                  </span>
                  <div className="text-3xl font-black text-gray-900">
                    ${Number(auction.currentBid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/auction/${auction.id}`}
                  className="block w-full text-center bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Join & Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-800">No Auctions Yet</h3>
          <p className="text-gray-500 mt-2">Check back later or launch an item as admin.</p>
          <Link href="/admin/create" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
            Go to Admin Panel →
          </Link>
        </div>
      )}
    </div>
  );
}