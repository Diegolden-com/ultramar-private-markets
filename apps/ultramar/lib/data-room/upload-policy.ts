import { DATA_ROOM_ALLOWED_MIME_TYPES, LCX_DATA_ROOM } from "@/lib/data-room/constants";

export type DataRoomAllowedMimeType = (typeof DATA_ROOM_ALLOWED_MIME_TYPES)[number];

export const DATA_ROOM_UPLOAD_ACCEPT = ".pdf,.jpg,.jpeg,.png";

export const REDACTED_DERIVATIVE_UPLOAD_ERROR =
  "Only reviewed, redacted PDF, JPEG, or PNG derivatives are allowed. Raw workbooks and tabular files are blocked.";

const MIME_BY_EXTENSION = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
} as const satisfies Record<string, DataRoomAllowedMimeType>;

const FORBIDDEN_WORKBOOK_EXTENSION = /(?:^|\.)(?:xlsx?|xlsm|xlsb|csv|tsv|ods|numbers)(?:\.|$)/i;

export async function inspectRedactedDerivative(file: File): Promise<{
  mimeType: DataRoomAllowedMimeType;
  filename: string;
}> {
  const filename = validateRedactedDerivativeFilename(file.name);

  if (file.size <= 0) throw new Error("Choose a non-empty file.");
  if (file.size > LCX_DATA_ROOM.maxFileSizeBytes) {
    throw new Error("Files must be 25 MB or smaller.");
  }

  // Read every byte within the already-enforced 25 MiB bound. Header checks
  // alone accept a PDF/JPEG/PNG polyglot containing an OOXML ZIP payload later
  // in the file, which would defeat the raw-workbook boundary.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const declaredMimeType = normalizeMimeType(file.type);
  const detectedMimeType = detectMimeType(bytes);
  const expectedMimeType = MIME_BY_EXTENSION[filename.extension];

  if (
    !detectedMimeType
    || detectedMimeType !== expectedMimeType
    || containsArchiveOrOoxmlPayload(bytes)
  ) {
    throw new Error(REDACTED_DERIVATIVE_UPLOAD_ERROR);
  }

  if (declaredMimeType && declaredMimeType !== detectedMimeType) {
    throw new Error("The file type does not match its contents.");
  }

  return {
    mimeType: detectedMimeType,
    // Never carry a potentially sensitive source-workbook name into the
    // version register or a download Content-Disposition header.
    filename: `redacted-derivative.${filename.extension}`,
  };
}

export async function sha256Hex(file: Blob) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateRedactedDerivativeFilename(input: string): { normalized: string; extension: keyof typeof MIME_BY_EXTENSION } {
  const normalized = input.normalize("NFKC").trim();
  const lowercase = normalized.toLocaleLowerCase("en-US");

  if (!normalized || normalized.length > 180 || FORBIDDEN_WORKBOOK_EXTENSION.test(lowercase)) {
    throw new Error(REDACTED_DERIVATIVE_UPLOAD_ERROR);
  }

  const extension = lowercase.split(".").pop();
  if (!extension || !(extension in MIME_BY_EXTENSION)) {
    throw new Error(REDACTED_DERIVATIVE_UPLOAD_ERROR);
  }

  return { normalized, extension: extension as keyof typeof MIME_BY_EXTENSION };
}

function normalizeMimeType(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

function detectMimeType(bytes: Uint8Array): DataRoomAllowedMimeType | null {

  if (
    bytes.length >= 5
    && bytes[0] === 0x25
    && bytes[1] === 0x50
    && bytes[2] === 0x44
    && bytes[3] === 0x46
    && bytes[4] === 0x2d
  ) {
    return "application/pdf";
  }

  if (
    bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  return null;
}

function containsArchiveOrOoxmlPayload(bytes: Uint8Array) {
  for (let index = 0; index + 3 < bytes.length; index += 1) {
    if (
      bytes[index] === 0x50
      && bytes[index + 1] === 0x4b
      && (
        (bytes[index + 2] === 0x03 && bytes[index + 3] === 0x04)
        || (bytes[index + 2] === 0x05 && bytes[index + 3] === 0x06)
        || (bytes[index + 2] === 0x07 && bytes[index + 3] === 0x08)
      )
    ) {
      return true;
    }
  }

  // A genuine OOXML file is a ZIP archive, but include its stable directory
  // markers as a belt-and-suspenders guard against intentionally malformed
  // polyglots that omit a conventional local-file header.
  return containsBytes(bytes, "[Content_Types].xml") || containsBytes(bytes, "xl/workbook.xml");
}

function containsBytes(bytes: Uint8Array, marker: string) {
  const encoded = new TextEncoder().encode(marker);
  for (let index = 0; index + encoded.length <= bytes.length; index += 1) {
    let matches = true;
    for (let markerIndex = 0; markerIndex < encoded.length; markerIndex += 1) {
      if (bytes[index + markerIndex] !== encoded[markerIndex]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}
