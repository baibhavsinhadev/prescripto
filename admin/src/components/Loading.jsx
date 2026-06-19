const Loading = () => {
    return (
        <div
            className="flex flex-col items-center justify-center py-20"
            role="status"
            aria-live="polite"
        >
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
            </div>

            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loading;