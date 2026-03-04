import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";

const MODEL_PATH = "/models/vosk-model-small-en-us.tar.gz";

/**
 * useVoiceControl – reusable hook for Vosk-powered voice commands.
 *
 * Returned state:
 *   isListening, isModelLoading, transcript, partialTranscript, error
 *
 * Returned actions:
 *   startListening, stopListening, toggleListening
 */
export const useVoiceControl = () => {
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const { products } = useProductStore();

    const [isListening, setIsListening] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [partialTranscript, setPartialTranscript] = useState("");
    const [error, setError] = useState(null);

    // Refs to persist across renders
    const modelRef = useRef(null);
    const recognizerRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);

    // ─── Command parser ─────────────────────────────────────────────
    const processCommand = useCallback(
        (text) => {
            const lower = text.trim().toLowerCase();
            if (!lower) return;

            console.log("[VoiceControl] Processing command:", lower);
            setTranscript(lower);

            // 1. Search command: "search <query>"
            if (lower.startsWith("search ")) {
                const query = lower.replace("search ", "").trim();
                if (query) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    return;
                }
            }

            // 2. Cart commands
            if (
                lower === "open cart" ||
                lower === "go to cart" ||
                lower === "show cart" ||
                lower === "cart" ||
                lower === "go to guard" ||
                lower === "go to gaurd" ||
                lower.includes("open cart") ||
                lower.includes("go to cart") ||
                lower.includes("go to guard") ||
                lower.includes("open gaurd")
            ) {
                navigate("/cart");
                return;
            }

            // 3. Checkout commands
            if (
                lower === "go to checkout" ||
                lower === "checkout" ||
                lower === "proceed to checkout" ||
                lower.includes("checkout")
            ) {
                navigate("/cart");
                return;
            }

            // 4. Home commands
            if (
                lower === "go home" ||
                lower === "home" ||
                lower === "go to home" ||
                lower.includes("go home") ||
                lower.includes("go to home")
            ) {
                navigate("/");
                return;
            }

            // 5. Add to cart
            if (
                lower === "add to cart" ||
                lower === "add this to cart" ||
                lower === "add item to cart" ||
                lower.includes("add to cart")
            ) {
                if (products && products.length > 0) {
                    addToCart(products[0]);
                }
                return;
            }

            // 6. Category commands: "show <category>"
            const categoryMatch = lower.match(
                /^(?:show|browse|view)\s+(.+)$/
            );
            if (categoryMatch) {
                const category = categoryMatch[1].trim().replace(/\s+/g, "-");
                navigate(`/category/${encodeURIComponent(category)}`);
                return;
            }

            console.log("[VoiceControl] No command matched for:", lower);
        },
        [navigate, addToCart, products]
    );

    // ─── Load Vosk model (lazy, once) ───────────────────────────────
    const loadModel = useCallback(async () => {
        if (modelRef.current) return modelRef.current;

        setIsModelLoading(true);
        setError(null);

        try {
            const { createModel } = await import("vosk-browser");
            console.log("[VoiceControl] Loading Vosk model from", MODEL_PATH);
            const model = await createModel(MODEL_PATH);
            console.log("[VoiceControl] Model loaded successfully");
            modelRef.current = model;
            setIsModelLoading(false);
            return model;
        } catch (err) {
            console.error("[VoiceControl] Model load failed:", err);
            setError("Failed to load speech recognition model. Please try again.");
            setIsModelLoading(false);
            throw err;
        }
    }, []);

    // ─── Start listening ────────────────────────────────────────────
    const startListening = useCallback(async () => {
        try {
            setError(null);

            // 1. Load model
            const model = await loadModel();

            // 2. Get mic stream first
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate: 16000,
                },
            });
            mediaStreamRef.current = stream;

            // 3. Create AudioContext
            const audioContext = new (window.AudioContext ||
                window.webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            // 4. Create recognizer with the AudioContext's actual sample rate
            const recognizer = new model.KaldiRecognizer(audioContext.sampleRate);
            recognizerRef.current = recognizer;

            recognizer.on("result", (message) => {
                console.log("[VoiceControl] Final result:", JSON.stringify(message));
                const text = message?.result?.text;
                console.log("[VoiceControl] Recognized text:", text);
                if (text && text.trim().length > 0) {
                    console.log("[VoiceControl] About to process:", text);
                    processCommand(text);
                } else {
                    console.log("[VoiceControl] Empty or no text recognized");
                }
            });

            recognizer.on("partialresult", (message) => {
                const partial = message?.result?.partial;
                if (partial) {
                    setPartialTranscript(partial);
                }
            });

            // 5. Connect audio pipeline
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
                try {
                    // acceptWaveform expects an AudioBuffer
                    recognizer.acceptWaveform(event.inputBuffer);
                } catch (e) {
                    // Recognizer may have been freed
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            setIsListening(true);
            console.log("[VoiceControl] Listening started, sample rate:", audioContext.sampleRate);
        } catch (err) {
            console.error("[VoiceControl] Failed to start:", err);
            if (err.name === "NotAllowedError") {
                setError("Microphone permission denied. Please allow mic access.");
            } else {
                setError("Failed to start voice recognition. Please try again.");
            }
            setIsListening(false);
        }
    }, [loadModel, processCommand]);

    // ─── Stop listening ─────────────────────────────────────────────
    const stopListening = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => { });
            audioContextRef.current = null;
        }

        if (recognizerRef.current) {
            try {
                recognizerRef.current.remove();
            } catch (e) {
                // already removed
            }
            recognizerRef.current = null;
        }

        processorRef.current = null;
        setIsListening(false);
        setPartialTranscript("");
    }, []);

    // ─── Toggle ─────────────────────────────────────────────────────
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return {
        isListening,
        isModelLoading,
        transcript,
        partialTranscript,
        error,
        startListening,
        stopListening,
        toggleListening,
    };
};
