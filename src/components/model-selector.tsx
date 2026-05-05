import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {/* I applied explicit dark blue classes directly to the trigger to prevent it from defaulting to the light background variable. */}
      <SelectTrigger className="w-full border-blue-500/30 bg-blue-950 text-blue-100 focus:ring-1 focus:ring-blue-500 hover:bg-blue-900/80 transition-colors">
        <SelectValue placeholder="Select an architecture" />
      </SelectTrigger>
      {/* I removed the light-mode fallbacks to bypass the Radix Portal escaping the dark mode wrapper, keeping the list definitively blue. */}
      <SelectContent className="border-blue-600 bg-blue-950 text-blue-50">
        <SelectItem
          value="b1"
          className="focus:bg-blue-600 focus:text-blue-50 cursor-pointer"
        >
          EfficientNet-B1
        </SelectItem>
        <SelectItem
          value="b3"
          className="focus:bg-blue-600 focus:text-blue-50 cursor-pointer"
        >
          EfficientNet-B3
        </SelectItem>
        <SelectItem
          value="b5"
          className="focus:bg-blue-600 focus:text-blue-50 cursor-pointer"
        >
          EfficientNet-B5
        </SelectItem>
        <SelectItem
          value="b7"
          className="focus:bg-blue-600 focus:text-blue-50 cursor-pointer"
        >
          EfficientNet-B7
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
