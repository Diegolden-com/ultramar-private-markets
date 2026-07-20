export const LCX_DATA_ROOM = {
  id: "33333333-3333-4333-8333-333333333333",
  slug: "lcx-capital",
  ticker: "lcx",
  path: "/private-equities/assets/lcx/dataroom",
  bucket: "data-room-documents",
  signedUrlLifetimeSeconds: 60,
  maxFileSizeBytes: 25 * 1024 * 1024,
} as const;

export const DATA_ROOM_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
] as const;
