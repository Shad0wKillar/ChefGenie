# ChefGenie

## Overview
ChefGenie is an intelligent web application designed to classify food images into specific categories: pizza, steak, and sushi. The application features a dark-themed user interface that communicates with a remote deep learning backend. The backend runs a transfer-learned EfficientNet model architecture hosted on Hugging Face Spaces to perform fast, accurate image classification.

## Features
- **Model Selection**: Dynamically switch between model configurations (defaulting to the B1 architecture variant) prior to evaluation.
- **Drag-and-Drop Image Upload**: A robust image selection container supporting direct uploads or click-to-select behavior.
- **Asynchronous Inference Tracking**: Real-time interface updates, including a custom secondary status message that triggers if the backend container requires cold-start initialization.
- **Interactive Metrics Display**: Visual breakdown of classification metrics once prediction results are received.
- **Fluid UI Animations**: Micro-interactions, fade states, and loading indicators driven by Framer Motion.

## Technical Stack
- **Framework**: Next.js 16 (App Router architecture)
- **Library**: React 19 (Client-side hydration handles extension compatibility safely)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with native CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Dependencies Management**: Monitored and configured via pnpm workspaces

## Directory Structure
- `src/app/page.tsx`: The core entry page managing layout columns, structural state mounting, and high-level component organization.
- `src/hooks/use-prediction.tsx`: A custom React hook containing state variables for the file data, model name, loading lifecycle, and HTTP requests.
- `src/components/image-upload.tsx`: Interface handling file ingestion and initial format processing.
- `src/components/model-selector.tsx`: Dropdown or button group layout facilitating adjustments to model configurations.
- `src/components/genie-response.tsx` & `results-display.tsx`: Analytical readouts displaying classification confidence structures.

## Installation and Development

### Prerequisites
Ensure that Node.js and the pnpm package manager are installed.

### Execution Instructions
1. Navigate to the root folder containing the project files:
   ```bash
   cd ChefGenie
   ```

2. Install the production and development dependencies:
   ```bash
   pnpm install
   ```

3. Initialize the local development server:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000 inside the web browser to access the interface.

4. Compile and bundle optimization assets for a production deployment:
   ```bash
   pnpm build
   ```

5. Run the compiled production build locally:
   ```bash
   pnpm start
   ```

## API and Backend Specification
The client communicates directly with a deployed model endpoint using multipart form transmission.

### Endpoint Definition
- **URL**: `https://shad0wkillar-efficientnet-transferlearned.hf.space/predict`
- **Method**: `POST`
- **Query String Parameter**: `model_type` (string value designating architectural variant, e.g., `b1, b3, b5 and b7`)

### Request Payload
The body must consist of standard `FormData` appending the image asset under the key designation `file`.

### Response Payload Structure
The endpoint evaluates and distributes confidence floats mapped to the respective culinary indices:
```json
{
  "pizza": 0.852,
  "steak": 0.114,
  "sushi": 0.034
}
```
