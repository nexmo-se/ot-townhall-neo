// @flow
export default {
  apiKey: process.env.OPENTOK_API_KEY || "",
  apiSecret: process.env.OPENTOK_API_SECRET || "",
  recordingMode: process.env.OPENTOK_RECORDING_MODE || "opentok",
  mediaMode: process.env.OPENTOK_MEDIA_MODE || "routed"
}