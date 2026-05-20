export default {
  port: process.env.VCR_PORT || process.env.PORT || 3000,
  host: process.env.HOST || "0.0.0.0"
};