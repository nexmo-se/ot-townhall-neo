export default {
  url: process.env.MONGODB_URL || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017",
  name: process.env.MONGODB_NAME || process.env.MONGODB_DB_NAME || "townhall",
  useTls: process.env.MONGODB_USE_TLS === "true",
  tlsCertificate: process.env.MONGODB_TLS_CERTIFICATE || ""
};