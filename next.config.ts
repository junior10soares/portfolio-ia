import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // onnxruntime-node (dependência do transformers.js) carrega libonnxruntime.so.1
  // via dlopen do sistema operacional — o rastreador de arquivos do Next não
  // detecta esse tipo de dependência nativa automaticamente, então ela precisa
  // ser incluída manualmente ou a função quebra em produção (na Vercel) com
  // "libonnxruntime.so.1: cannot open shared object file".
  outputFileTracingIncludes: {
    "/api/chat": ["./node_modules/onnxruntime-node/bin/**/*"],
    "/api/lab/embeddings-compare": ["./node_modules/onnxruntime-node/bin/**/*"],
    "/api/lab/rag-search": ["./node_modules/onnxruntime-node/bin/**/*"],
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
