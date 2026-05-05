"use client";

import { motion, Variants } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { PredictionResults } from "@/hooks/use-prediction";

interface ResultsDisplayProps {
  results: PredictionResults | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } },
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  const sortedEntries = Object.entries(results).sort(([, a], [, b]) => b - a);
  const maxScore = sortedEntries[0][1];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col gap-4"
    >
      {sortedEntries.map(([label, score]) => {
        const percentage = score * 100;
        const isTopChoice = score === maxScore;

        return (
          <motion.div
            key={label}
            variants={itemVariants}
            className="flex flex-col gap-2"
          >
            <div className="flex justify-between text-sm font-medium">
              <span className="capitalize text-zinc-200">{label}</span>
              <span className="text-zinc-400">{percentage.toFixed(1)}%</span>
            </div>
            <Progress
              value={percentage}
              className="h-2 bg-zinc-800"
              indicatorClassName={
                isTopChoice
                  ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "bg-zinc-600"
              }
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
