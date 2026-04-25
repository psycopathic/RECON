import React from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoiceControl } from "../hooks/useVoiceControl";

const VoiceControl = () => {
    const {
        isListening,
        isSupported,
        transcript,
        partialTranscript,
        error,
        lastAction,
        toggleListening,
    } = useVoiceControl();

    return (
        <>
            {/* ── Transcript overlay ─────────────────────────────────── */}
            {(isListening || transcript || lastAction || error) && (
                <div
                    id="voice-transcript-overlay"
                    className="fixed bottom-24 right-6 z-50 max-w-xs w-full"
                >
                    <div
                        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-sky-200
                        p-4 space-y-2 transition-all duration-300"
                    >
                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <Volume2
                                size={16}
                                className={`${isListening ? "text-sky-500 animate-pulse" : "text-gray-400"
                                    }`}
                            />
                            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                                {isListening ? "Listening…" : "Voice Control"}
                            </span>
                        </div>

                        {/* Partial transcript (live) */}
                        {isListening && partialTranscript && (
                            <p className="text-sm text-gray-500 italic truncate">
                                {partialTranscript}
                            </p>
                        )}

                        {/* Final transcript */}
                        {transcript && (
                            <p className="text-sm font-medium text-gray-800">
                                <span className="text-sky-500">→</span> {transcript}
                            </p>
                        )}

                        {/* Last action feedback */}
                        {lastAction && (
                            <p className="text-xs font-medium text-emerald-600">
                                ✓ {lastAction}
                            </p>
                        )}

                        {/* Error */}
                        {error && <p className="text-xs text-red-500">{error}</p>}

                        {/* Help */}
                        {isListening && !partialTranscript && !transcript && (
                            <div className="text-xs text-gray-400 space-y-0.5">
                                <p>Try saying:</p>
                                <p className="pl-2">"Search running shoes"</p>
                                <p className="pl-2">"Open cart"</p>
                                <p className="pl-2">"Show electronics"</p>
                                <p className="pl-2">"Go home"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Floating mic button ────────────────────────────────── */}
            <button
                id="voice-control-btn"
                onClick={toggleListening}
                disabled={!isSupported}
                className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-lg cursor-pointer
          transition-all duration-300 ease-in-out
          ${!isSupported
                        ? "bg-gray-300 cursor-not-allowed"
                        : isListening
                            ? "bg-red-500 hover:bg-red-600 shadow-red-300/50 shadow-xl"
                            : "bg-sky-500 hover:bg-sky-600 shadow-sky-300/50 hover:shadow-xl"
                    }
        `}
                title={
                    !isSupported
                        ? "Voice not supported in this browser"
                        : isListening
                            ? "Stop listening"
                            : "Start voice control"
                }
            >
                {/* Pulse ring when listening */}
                {isListening && (
                    <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40 animate-ping" />
                        <span className="absolute inline-flex h-16 w-16 rounded-full border-2 border-red-300 opacity-60 animate-pulse" />
                    </>
                )}

                {isListening ? (
                    <MicOff size={24} className="text-white relative z-10" />
                ) : (
                    <Mic size={24} className="text-white" />
                )}
            </button>
        </>
    );
};

export default VoiceControl;
