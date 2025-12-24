import { createAuction } from "../../actions";

export default function AdminCreateAuction() {
    return (
        <main className="p-10 max-w-2xl mx-auto">
            <div className="bg-white shadow-2xl rounded-3xl border p-8">
                <h1 className="text-3xl font-black mb-2">Launch New Auction</h1>
                <p className="text-gray-500 mb-8">Fill in the details to list a new item for live bidding.</p>

                <form action={createAuction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Item Title</label>
                        <input
                            name="title"
                            required
                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition"
                            placeholder="e.g. 1967 Mustang Fastback"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition"
                            placeholder="Provide a detailed description of the item..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price ($)</label>
                            <input
                                name="startPrice"
                                type="number"
                                step="0.01"
                                required
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition"
                                placeholder="100.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">End Date & Time</label>
                            <input
                                name="endTime"
                                type="datetime-local"
                                required
                                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                        Create Listing
                    </button>
                </form>
            </div>
        </main>
    );
}