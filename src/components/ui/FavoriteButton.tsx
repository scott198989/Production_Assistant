import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useCalculator, FavoriteCalculator } from "../../contexts/CalculatorContext";

interface FavoriteButtonProps {
  calculator: FavoriteCalculator;
  size?: "sm" | "md";
}

export function FavoriteButton({ calculator, size = "md" }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useCalculator();
  const isFav = isFavorite(calculator.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(calculator.id);
    } else {
      addFavorite(calculator);
    }
  };

  const iconSize = size === "sm" ? 14 : 18;

  return (
    <motion.button
      onClick={handleClick}
      className={`rounded-full p-1.5 transition-colors ${
        isFav
          ? "text-amber-500 hover:text-amber-600"
          : "text-slate-400 dark:text-slate-500 hover:text-amber-500"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        size={iconSize}
        fill={isFav ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </motion.button>
  );
}

export default FavoriteButton;
