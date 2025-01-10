import { createProxyMiddleware } from "http-proxy-middleware";

const baseUrl = "https://image.tmdb.org";

const imageProxy = createProxyMiddleware({
  target: baseUrl,
  changeOrigin: true,
  pathRewrite: {
    "^/tmdb": "",
  },
});

export default imageProxy;
