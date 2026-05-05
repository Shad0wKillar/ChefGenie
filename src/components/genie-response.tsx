"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PredictionResults } from "@/hooks/use-prediction";
import { useState, useEffect } from "react";

import imgIdle from "../../assets_frontend_efficient/I_got_it_1.png";
import imgThinking from "../../assets_frontend_efficient/Thinking.png";
import imgThinkingHard from "../../assets_frontend_efficient/Thinking_hard.png";
import imgThinkingHard2 from "../../assets_frontend_efficient/Thinking_hard_2.png";
import imgEasy from "../../assets_frontend_efficient/Easy.png";

interface GenieResponseProps {
  results: PredictionResults | null;
  selectedModel: string;
  isUploading: boolean;
  hasPrediction: boolean;
}

const classDisplayNames: Record<keyof PredictionResults, string> = {
  pizza: "PIZZA",
  steak: "STEAK",
  sushi: "SUSHI",
};

const idlePhrases = [
  "Feed me an image, and I shall unveil its secrets!",
  "Awaiting your capture. Show me the food!",
  "Ready when you are. Toss an image my way.",
  "My sensors are tingling. What do we have?",
];

const processingPhrases = [
  "Analyzing the quantum foam... hold on!",
  "Crunching the pixels. Give me a second...",
  "Consulting my neural network...",
  "Processing image data. The suspense is real!",
];

const getHighConfPhrases = (name: string) => [
  `That is undoubtedly a magnificent ${name}!`,
  `My circuits are sure that's a ${name}.`,
  `Easy one. That right there is a ${name}.`,
  `No doubt, you've got a ${name} here.`,
];

const getMedConfPhrases = (name: string) => [
  `I'm fairly confident that's a ${name}. Looks delicious.`,
  `Looks like a ${name} to me. Am I right?`,
  `I'd say that's a ${name}. Good looking too.`,
  `My educated guess? Definitely a ${name}.`,
];

const getLowConfPhrases = (name: string) => [
  `Hmm, it sort of looks like a ${name}?`,
  `Tricky one! Is that a ${name}? Need data.`,
  `I'm stumped. A blurry ${name} perhaps?`,
  `Hard to tell... I'll guess it's a ${name}.`,
];

export function GenieResponse({
  results,
  selectedModel,
  isUploading,
  hasPrediction,
}: GenieResponseProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [geniePhrase, setGeniePhrase] = useState(
    "Feed me an image, and I shall unveil its secrets!",
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // I moved the dialogue logic into a useEffect to treat randomness as a side-effect and added an anti-repeat check.
  useEffect(() => {
    if (!isMounted) return;

    const pickRandom = (arr: string[], current: string) => {
      let next = current;
      while (next === current && arr.length > 1) {
        next = arr[Math.floor(Math.random() * arr.length)];
      }
      return next;
    };

    if (isUploading) {
      setGeniePhrase((prev) => pickRandom(processingPhrases, prev));
      return;
    }

    if (!hasPrediction || !results) {
      setGeniePhrase((prev) => pickRandom(idlePhrases, prev));
      return;
    }

    const entries = Object.entries(results) as [
      keyof PredictionResults,
      number,
    ][];
    entries.sort(([, a], [, b]) => b - a);
    const topEntry = entries[0];
    const topClass = topEntry[0];
    const score = topEntry[1];

    const displayName = classDisplayNames[topClass];

    if (score >= 0.8) {
      setGeniePhrase((prev) =>
        pickRandom(getHighConfPhrases(displayName), prev),
      );
    } else if (score >= 0.5) {
      setGeniePhrase((prev) =>
        pickRandom(getMedConfPhrases(displayName), prev),
      );
    } else {
      setGeniePhrase((prev) =>
        pickRandom(getLowConfPhrases(displayName), prev),
      );
    }
  }, [results, isUploading, hasPrediction, isMounted]);

  let currentImage = imgIdle;
  if (isUploading) {
    if (selectedModel === "b1" || selectedModel === "b3") {
      currentImage = imgThinking;
    } else if (selectedModel === "b5") {
      currentImage = imgThinkingHard;
    } else if (selectedModel === "b7") {
      currentImage = imgThinkingHard2;
    }
  } else if (hasPrediction) {
    currentImage = imgEasy;
  }

  return (
    <div className="relative w-full h-full min-h-87.5 flex items-center justify-center">
      <div className="absolute left-4/5 top-1/2 translate-x-[-110%] -translate-y-1/2 w-80 h-80 shrink-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.src}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              },
              opacity: { duration: 0.25 },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={currentImage}
              alt="Genie Character"
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute left-2/3 top-1/2 translate-x-[-10%] translate-y-[-80%] w-full max-w-32.5 sm:max-w-32.5">
        <motion.div
          key={geniePhrase}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, 8, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 4.6,
              ease: "easeInOut",
              delay: 0.3,
            },
            scale: { type: "spring", stiffness: 260, damping: 20 },
          }}
          className="relative rounded-2xl rounded-tl-none border border-zinc-700 bg-zinc-800 p-4 shadow-xl"
        >
          <div className="absolute -left-3 top-4 size-0 border-r-12 border-t-12 border-r-zinc-800 border-t-transparent hidden sm:block" />
          <div
            className="absolute -left-3.5 top-4 size-0 border-r-13 border-t-13 border-r-zinc-700 border-t-transparent hidden sm:block"
            style={{ zIndex: -1 }}
          />

          <p className="text-sm leading-relaxed text-zinc-100">{geniePhrase}</p>
        </motion.div>
      </div>
    </div>
  );
}
