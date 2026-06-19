const Loading = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Loading content"
        >
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"
                aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loading;