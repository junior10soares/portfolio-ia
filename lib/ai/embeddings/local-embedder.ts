import { env, pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

// O cache padrão fica dentro de node_modules, que é somente leitura em
// funções serverless da Vercel. /tmp é o único diretório com permissão de
// escrita em runtime — sem isso, o download do modelo falha em produção.
env.cacheDir = "/tmp/transformers-cache/";

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
