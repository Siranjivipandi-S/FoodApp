import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface SuggestionModalProps {
  onClose: () => void;
  selectCategory: (categories: string[]) => void;
}

const emojiMap: Record<string, string> = {
  Vegetarian: "🥦 Garden Fresh Vegetarian",
  Chicken: "🍗 Chicken Lovers' Feast",
  Seafood: "🦐 Ocean's Finest Seafood",
  Breakfast: "🥞 Rise & Shine Breakfast",
  Starter: "🍹 Refreshing Starters & Sips",
  Dessert: "🍰 Sweet Treats & Snacks",
};

const SuggestionModal = ({ onClose, selectCategory }: SuggestionModalProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleConfirm = () => {
    selectCategory(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 rounded-lg backdrop-blur-sm flex justify-center items-center z-50 p-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4 text-white"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white hover:text-red-300 transition duration-200"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Need Help Getting Started?
          </h2>
          <p className="mb-6 text-white/90">Pick your favorite categories:</p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(emojiMap).map(([key, label], idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full font-medium shadow transition duration-200 border-2 ${
                  selected.includes(key)
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/40 hover:bg-white/10"
                }`}
                onClick={() => toggleCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition duration-200"
          >
            Confirm Selection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuggestionModal;
