export function SuccessCheck() {
    return (
        <div className="success-ring mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <svg viewBox="0 0 24 24" className="size-7" fill="none">
                <path
                    className="success-check"
                    d="M5 12.5 9.2 17 19 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
