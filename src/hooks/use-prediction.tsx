import { useState } from "react";

export type PredictionResults = {
  pizza: number;
  steak: number;
  sushi: number;
};

export function usePrediction() {
  const [file, setFile] = useState<File | null>(null);
  // I set the default model parameter to b1.
  const [model, setModel] = useState<string>("b1");
  const [results, setResults] = useState<PredictionResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResults(null);
    setError(null);
    setIsSuccess(false);
  };

  const handleModelSelect = (selectedModel: string) => {
    setModel(selectedModel);
    setResults(null);
    setError(null);
    setIsSuccess(false);
  };

  const resetPrediction = () => {
    setFile(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  };

  const submitImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://shad0wkillar-efficientnet-transferlearned.hf.space/predict?model_type=${model}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data: PredictionResults = await response.json();
      setResults(data);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during prediction.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    file,
    model,
    results,
    isLoading,
    isSuccess,
    error,
    setResults,
    setIsLoading,
    setError,
    handleFileSelect,
    handleModelSelect,
    resetPrediction,
    submitImage,
  };
}
