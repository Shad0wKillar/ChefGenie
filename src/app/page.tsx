"use client";

import { usePrediction } from "@/hooks/use-prediction";
import { ImageUpload } from "@/components/image-upload";
import { ModelSelector } from "@/components/model-selector";
import { GenieResponse } from "@/components/genie-response";
import { ResultsDisplay } from "@/components/results-display";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    file,
    model,
    results,
    isLoading,
    error,
    handleFileSelect,
    handleModelSelect,
    submitImage,
  } = usePrediction();

  const [loadingMessage, setLoadingMessage] = useState("Analyzing...");
  const [isMounted, setIsMounted] = useState(false);

  // Mark the component as successfully mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setLoadingMessage("Analyzing...");
      timer = setTimeout(() => {
        setLoadingMessage(
          "Waking up the AI backend... this might take a minute on the first run.",
        );
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-zinc-800">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ChefGenie
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-4 w-full max-w-4xl p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left/Top Column: Controls */}
          <div className="flex flex-col gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">
                Model Architecture
              </label>
              <ModelSelector value={model} onValueChange={handleModelSelect} />
            </div>

            <ImageUpload selectedFile={file} onFileSelect={handleFileSelect} />

            {/* I added suppressHydrationWarning here to stop React from panicking if an extension modifies the DOM before hydration. */}
            <Button
              onClick={submitImage}
              disabled={!isMounted || !file || isLoading}
              suppressHydrationWarning
              className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right/Bottom Column: Interaction & Feedback */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm min-h-125">
            <div className="absolute inset-0 z-10 flex items-center justify-center pb-[25%] pointer-events-none animate-float-genie">
              <GenieResponse
                results={results}
                selectedModel={model}
                isUploading={isLoading}
                hasPrediction={!!results}
              />
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/2 z-20 bg-zinc-950/20 backdrop-blur-xl border-t border-white/2 border-x p-6 overflow-y-auto flex flex-col items-center justify-center shadow-[0_-12px_40px_rgba(0,0,0,0.6)]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                    <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-blue-500" />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-zinc-100 font-semibold max-w-50"
                  >
                    {loadingMessage}
                  </motion.p>
                </div>
              ) : results ? (
                <ResultsDisplay results={results} />
              ) : (
                <span className="text-center text-sm text-zinc-200 font-semibold">
                  Ready for prediction. Select an image to begin.
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
