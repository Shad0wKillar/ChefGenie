export type SampleImage = {
  id: string;
  label: string;
  src: string;
  fileName: string;
};

// I keep a handful of Food-101 style samples in /public so visitors can try the
// models without having to hunt down a photo of their own.
export const SAMPLE_IMAGES: SampleImage[] = [
  { id: "pizza-1", label: "Pizza", src: "/samples/pizza-1.jpg", fileName: "pizza-1.jpg" },
  { id: "pizza-2", label: "Pizza", src: "/samples/pizza-2.jpg", fileName: "pizza-2.jpg" },
  { id: "pizza-3", label: "Pizza", src: "/samples/pizza-3.jpg", fileName: "pizza-3.jpg" },
  { id: "steak-1", label: "Steak", src: "/samples/steak-1.jpg", fileName: "steak-1.jpg" },
  { id: "steak-2", label: "Steak", src: "/samples/steak-2.jpg", fileName: "steak-2.jpg" },
  { id: "steak-3", label: "Steak", src: "/samples/steak-3.jpg", fileName: "steak-3.jpg" },
  { id: "sushi-1", label: "Sushi", src: "/samples/sushi-1.jpg", fileName: "sushi-1.jpg" },
  { id: "sushi-2", label: "Sushi", src: "/samples/sushi-2.jpg", fileName: "sushi-2.jpg" },
  { id: "sushi-3", label: "Sushi", src: "/samples/sushi-3.jpg", fileName: "sushi-3.jpg" },
];
