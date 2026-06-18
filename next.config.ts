import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // onnxruntime-node (dependência do transformers.js) carrega libonnxruntime.so.1
  // via dlopen do sistema operacional — o rastreador de arquivos do Next não
  // detecta esse tipo de dependência nativa automaticamente, então ela precisa
  // ser incluída manualmente ou a função quebra em produção (na Vercel) com
  // "libonnxruntime.so.1: cannot open shared object file". Apontamos só para
  // os 3 arquivos essenciais de Linux (binding + lib principal + shared) —
  // o pacote completo (CUDA/TensorRT/win32/darwin) passa de 500MB e estoura
  // o limite de 250MB de função da Vercel, e não precisamos de GPU aqui.
  outputFileTracingIncludes: {
    "/api/chat": [
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/onnxruntime_binding.node",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime.so.1",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime_providers_shared.so",
    ],
    "/api/lab/embeddings-compare": [
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/onnxruntime_binding.node",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime.so.1",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime_providers_shared.so",
    ],
    "/api/lab/rag-search": [
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/onnxruntime_binding.node",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime.so.1",
      "./node_modules/onnxruntime-node/bin/napi-v6/linux/**/libonnxruntime_providers_shared.so",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
