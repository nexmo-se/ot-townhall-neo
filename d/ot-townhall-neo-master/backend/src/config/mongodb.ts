export default {
  url: process.env.MONGODB_DATABASE_URL,
  name: process.env.MONGODB_DATABASE_NAME,
  useTls: (process.env.MONGODB_USE_TLS ?? "false").toLowerCase() === "true",
  tlsCertificate: process.env.MONGODB_TLS_CA
};