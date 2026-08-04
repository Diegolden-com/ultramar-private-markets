export const LCX_DATA_ROOM = {
  id: "33333333-3333-4333-8333-333333333333",
  slug: "lcx-secondary-transfer",
  ticker: "lcx",
  path: "/private-equities/assets/lcx/dataroom",
  name: "LCX secondary transfer data room",
  status: "Data room buildout · not a live offer",
  bucket: "data-room-documents",
  signedUrlLifetimeSeconds: 60,
  maxFileSizeBytes: 25 * 1024 * 1024,
} as const;

export const DATA_ROOM_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const LCX_DATA_ROOM_CLEARANCE_CLASSIFICATION =
  "CONFIDENTIAL · SECONDARY TRANSFER REVIEW · NOT A LIVE OFFER";

export const DATA_ROOM_CLEARANCE_REVIEW_ROLES = [
  "finance_ops",
  "redaction",
  "counsel",
  "data_room_admin",
] as const;

export const DATA_ROOM_CLEARANCE_ATTESTATION_STATEMENT =
  "I reviewed the assigned derivative in my capacity and confirm the required classification label is present. This record does not represent automated semantic analysis or certify professional counsel quality.";
