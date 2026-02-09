export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[50]">
            {/* Reactor Core */}
            <div className="relative w-24 h-24">
                {/* Core Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />

                {/* Spinning Rings */}
                <div className="absolute inset-0 border-t-2 border-l-2 border-blue-400/80 rounded-full animate-spin [animation-duration:1s]" />
                <div className="absolute inset-2 border-r-2 border-b-2 border-purple-400/80 rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />

                {/* Center Point */}
                <div className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
            </div>

            {/* Loading Text */}
            <div className="absolute bottom-1/4 text-center">
                <p className="text-white/40 font-mono text-sm tracking-[0.2em] animate-pulse">
                    INITIALIZING HYPERDRIVE
                </p>
            </div>
        </div>
    )
}
