import { expect, test } from "@playwright/test";
import { normalizeReactActionFormData } from "../../lib/data-room/action-form-data";

const releaseFields = new Set(["pwaSourceId", "modelAsOf"]);

test.describe("React action form-data normalization", () => {
  test("accepts the observed useActionState envelope and restores only approved fields", () => {
    const serialized = new FormData();
    // This is the shape captured from a real DataRoomActionForm POST:
    // user inputs are positional, while the Server Action state/reference is
    // sent separately as `0` and `$ACTION_*` metadata.
    serialized.append("0", "{\"status\":\"idle\"}");
    serialized.append("_1_$ACTION_REF_1", "server-action-reference");
    serialized.append("_1_$ACTION_KEY", "server-action-key");
    serialized.append("_1_pwaSourceId", "e2e-lcx-release-v3");
    serialized.append("_1_modelAsOf", "2026-08-06");

    const normalized = normalizeReactActionFormData(serialized, releaseFields);

    expect(normalized).not.toBeNull();
    expect([...normalized!.entries()]).toEqual([
      ["pwaSourceId", "e2e-lcx-release-v3"],
      ["modelAsOf", "2026-08-06"],
    ]);
  });

  test("fails closed for duplicate canonical fields, including a raw plus prefixed pair", () => {
    const serialized = new FormData();
    serialized.append("_1_pwaSourceId", "first-source");
    serialized.append("pwaSourceId", "second-source");
    serialized.append("_1_modelAsOf", "2026-08-06");

    expect(normalizeReactActionFormData(serialized, releaseFields)).toBeNull();
  });

  test("fails closed for an unexpected prefixed control", () => {
    const serialized = new FormData();
    serialized.append("_1_pwaSourceId", "e2e-lcx-release-v3");
    serialized.append("_1_modelAsOf", "2026-08-06");
    serialized.append("_1_candidateFile", "not-an-approved-metadata-field");

    expect(normalizeReactActionFormData(serialized, releaseFields)).toBeNull();
  });

  test("fails closed when a File is smuggled under raw, prefixed, or transport keys", () => {
    for (const key of ["pwaSourceId", "_1_pwaSourceId", "0", "_1_$ACTION_REF_1"]) {
      const serialized = new FormData();
      serialized.append("_1_pwaSourceId", "e2e-lcx-release-v3");
      serialized.append("_1_modelAsOf", "2026-08-06");
      serialized.set(key, new Blob(["not metadata"], { type: "application/pdf" }), "smuggled.pdf");

      expect(normalizeReactActionFormData(serialized, releaseFields), key).toBeNull();
    }
  });

  test("fails closed when a required metadata field is missing", () => {
    const serialized = new FormData();
    serialized.append("_1_pwaSourceId", "e2e-lcx-release-v3");

    expect(normalizeReactActionFormData(serialized, releaseFields)).toBeNull();
  });
});
