import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { voiceCategoryAliases } from "../constants/categories";

const categorySlugs = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
  "watches",
  "gadgets",
  "accessories",
];

const fuzzMap = {
  jeans: ["jeans", "genes", "gene", "jins", "jens", "gin", "gins", "janes", "gans", "denim", "denims"],
  "t-shirts": ["t shirt", "t shirts", "tshirt", "tshirts", "tee shirt", "tee shirts", "tees", "tee", "t-shirt", "shirt", "shirts"],
  shoes: ["shoes", "shoe", "shoo", "shuze", "shoots", "shos", "sneaker", "sneakers", "footwear"],
  glasses: ["glasses", "glass", "glasses", "glases", "glassis", "sunglasses", "specs", "spectacles", "gogal", "goggles"],
  jackets: ["jackets", "jacket", "jackett", "jakets", "jaks", "jockit", "jocket", "coats", "coat", "hoodie", "hoodies"],
  suits: ["suits", "suit", "suite", "soot", "sutes", "blazer", "blazers", "formal"],
  bags: ["bags", "bag", "beg", "bgs", "backpack", "backpacks", "handbag", "purse"],
  watches: ["watches", "watch", "wachs", "woch", "wach", "clocks", "timepiece"],
  gadgets: ["gadgets", "gadget", "gadjit", "electronics", "tech", "devices", "device"],
  accessories: ["accessories", "accessory", "acsessories", "extras", "belts", "belt"],
};

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function matchCategory(text) {
  const lower = text.toLowerCase().trim();

  for (const [cat, aliases] of Object.entries(fuzzMap)) {
    for (const alias of aliases) {
      if (lower === alias || lower.includes(alias)) {
        return cat;
      }
    }
  }

  if (voiceCategoryAliases[lower]) return voiceCategoryAliases[lower];

  const words = lower.split(/\s+/);
  let bestMatch = null;
  let bestScore = Infinity;

  for (const word of words) {
    for (const cat of categorySlugs) {
      const dist = levenshtein(word, cat.replace("-", ""));
      if (dist < bestScore && dist <= 3) {
        bestScore = dist;
        bestMatch = cat;
      }
    }
  }

  for (const word of words) {
    for (const [cat, aliases] of Object.entries(fuzzMap)) {
      for (const alias of aliases) {
        const dist = levenshtein(word, alias);
        if (dist < bestScore && dist <= 2) {
          bestScore = dist;
          bestMatch = cat;
        }
      }
    }
  }

  return bestMatch;
}

export const useVoiceControl = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { searchProducts, fetchProductsByCategory } = useProductStore();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState(null);
  const [lastAction, setLastAction] = useState("");

  const recognitionRef = useRef(null);

  const processCommand = useCallback(
    async (text) => {
      const lower = text.trim().toLowerCase();
      if (!lower) return;

      console.log("[Voice] Command:", lower);
      setTranscript(lower);
      setLastAction("");

      if (lower.startsWith("search ")) {
        const query = lower.replace("search ", "").trim();
        if (query) {
          searchProducts(query);
          navigate(`/search?q=${encodeURIComponent(query)}`);
          setLastAction(`Searching "${query}"`);
        }
        return;
      }

      if (lower.startsWith("find ")) {
        const query = lower.replace("find ", "").trim();
        if (query) {
          searchProducts(query);
          navigate(`/search?q=${encodeURIComponent(query)}`);
          setLastAction(`Finding "${query}"`);
        }
        return;
      }

      const cartAliases = ["cart", "card", "guard", "gaurd", "kart", "cut", "cat", "current", "god", "got", "cot", "gat", "gart", "cut", "court"];
      const isCart = cartAliases.some((a) => lower === a) ||
        (/^(?:open|show|go to|view)\s+/.test(lower) &&
        cartAliases.some((a) => lower.includes(a)));

      if (isCart || lower.includes("checkout") || lower.includes("check out")) {
        navigate("/cart");
        setLastAction("Opening cart");
        return;
      }

      if (
        lower === "go home" || lower === "home" || lower === "go to home" ||
        lower.includes("go home") || lower.includes("homepage") || lower === "main page"
      ) {
        navigate("/");
        setLastAction("Going home");
        return;
      }

      if (
        lower === "go back" || lower === "back" || lower === "go back" ||
        lower === "previous page"
      ) {
        navigate(-1);
        setLastAction("Going back");
        return;
      }

      if (
        lower.includes("login") || lower.includes("log in") || lower.includes("sign in")
      ) {
        navigate("/login");
        setLastAction("Opening login");
        return;
      }

      if (
        lower.includes("sign up") || lower.includes("signup") || lower.includes("register")
      ) {
        navigate("/signup");
        setLastAction("Opening signup");
        return;
      }

      if (
        lower.includes("profile") || lower.includes("my account") || lower.includes("account")
      ) {
        navigate("/profile");
        setLastAction("Opening profile");
        return;
      }

      if (
        lower.includes("add to cart") || lower.includes("add this") ||
        lower.includes("buy this") || lower.includes("add item")
      ) {
        const { singleProduct } = useProductStore.getState();
        if (singleProduct) {
          addToCart(singleProduct);
          setLastAction(`Added "${singleProduct.name}" to cart`);
        } else {
          setLastAction("Open a product first to add it");
        }
        return;
      }

      if (
        lower.includes("logout") || lower.includes("log out") || lower.includes("sign out")
      ) {
        const { useUserStore } = await import("../store/useUserStore.js");
        useUserStore.getState().logout();
        navigate("/");
        setLastAction("Logged out");
        return;
      }

      const categoryMatch = lower.match(
        /^(?:open|show|browse|view|go to|navigate to|visit)\s+(.+)$/
      );
      const categoryText = categoryMatch ? categoryMatch[1].trim() : lower;
      const matched = matchCategory(categoryText);

      if (matched) {
        fetchProductsByCategory(matched);
        navigate(`/category/${encodeURIComponent(matched)}`);
        setLastAction(`Showing ${matched}`);
        return;
      }

      setLastAction(`Didn't understand: "${lower}"`);
    },
    [navigate, addToCart, searchProducts, fetchProductsByCategory]
  );

  const isSupported = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }

    setError(null);
    setTranscript("");
    setPartialTranscript("");
    setLastAction("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) setPartialTranscript(interim);
      if (final) {
        setPartialTranscript("");
        processCommand(final);
      }
    };

    recognition.onerror = (event) => {
      console.error("[Voice] Error:", event.error);
      if (event.error === "not-allowed") {
        setError("Microphone permission denied. Please allow mic access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Try again.");
      } else if (event.error === "aborted") {
        // user cancelled, ignore
      } else {
        setError(`Voice error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setPartialTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, processCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setPartialTranscript("");
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    partialTranscript,
    error,
    lastAction,
    toggleListening,
    startListening,
    stopListening,
  };
};
