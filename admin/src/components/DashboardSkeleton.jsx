const DashboardSkeleton = () => {
    return (
        <div className="m-5">
            <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="flex items-center gap-3 bg-white p-4 min-w-52 rounded border border-gray-300"
                    >
                        <div className="w-14 h-14 rounded bg-gray-200 animate-pulse"></div>

                        <div className="space-y-2">
                            <div className="w-12 h-5 rounded bg-gray-200 animate-pulse"></div>
                            <div className="w-20 h-4 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white mt-10">
                <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-300">
                    <div className="w-6 h-6 rounded bg-gray-200 animate-pulse"></div>
                    <div className="w-40 h-5 rounded bg-gray-200 animate-pulse"></div>
                </div>

                <div className="border border-t-0 border-gray-300">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex items-center px-6 py-3 gap-3 border-b"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>

                            <div className="flex-1 space-y-2">
                                <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>
                                <div className="w-24 h-3 rounded bg-gray-200 animate-pulse"></div>
                            </div>

                            <div className="w-8 h-8 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;