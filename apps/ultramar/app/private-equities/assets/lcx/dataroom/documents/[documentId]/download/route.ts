import { signedDocumentResponse } from "@/lib/data-room/signed-document";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  return signedDocumentResponse(request, documentId, "download");
}
