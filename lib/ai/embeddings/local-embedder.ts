import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;

let pipelinePromise: Promise<FeatureExtractionPipeline> | null = null;

function getPipeline() {
  if (!pipelinePromise) {
    pipelinePromise = pipeline("feature-extraction", MODEL_ID);
  }
  return pipelinePromise;
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getPipeline();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}
