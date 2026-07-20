export const LCX_DATA_ROOM_ID = "33333333-3333-4333-8333-333333333333";
export const LCX_DATA_ROOM_BUCKET = "data-room-documents";
export const LCX_E2E_DOCUMENT_TITLE = "LCX E2E Financial Package";
export const LCX_E2E_DEFAULT_PASSWORD = "Test-password-2026!";

export const LCX_E2E_USERS = {
  issuer: {
    email: "issuer-e2e@example.test",
    fullName: "LCX E2E Issuer",
    role: "issuer" as const,
  },
  investor: {
    email: "no-grant-e2e@example.test",
    fullName: "LCX E2E Investor",
    role: "investor" as const,
  },
};
