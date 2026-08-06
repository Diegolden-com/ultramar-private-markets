/**
 * `useActionState` serializes ordinary form controls as `_<slot>_<name>` and
 * appends its own `$ACTION_*` / `0` protocol fields. Convert that transport
 * envelope back to a tightly-scoped application FormData before an action
 * reads it. This intentionally accepts raw names too, so direct invocations
 * still use the same validation path.
 *
 * Callers provide the only names their action accepts. Unknown names, duplicate
 * canonical names, and every non-string value are rejected, including a File
 * smuggled under either a raw or React-prefixed key.
 */
export function normalizeReactActionFormData(
  formData: FormData,
  allowedFields: ReadonlySet<string>,
  requiredFields: ReadonlySet<string> = allowedFields,
): FormData | null {
  const normalized = new FormData();

  for (const [rawName, value] of formData.entries()) {
    const fieldName = reactActionFieldName(rawName, value);
    if (fieldName === null) return null;
    if (fieldName === undefined) continue;

    if (
      !allowedFields.has(fieldName)
      || normalized.has(fieldName)
      || typeof value !== "string"
    ) {
      return null;
    }

    normalized.append(fieldName, value);
  }

  return [...requiredFields].every((fieldName) => normalized.has(fieldName))
    ? normalized
    : null;
}

function reactActionFieldName(
  rawName: string,
  value: FormDataEntryValue,
): string | null | undefined {
  // React's useActionState state argument is serialized as the literal `0`.
  // Treat it as transport only when it cannot carry bytes.
  if (rawName === "0") return typeof value === "string" ? undefined : null;

  const positionalField = rawName.match(/^_\d+_(.+)$/);
  const fieldName = positionalField?.[1] ?? rawName;

  // React action references are framework envelope metadata, never business
  // data. A file under a transport name is still invalid and fails closed.
  if (fieldName.startsWith("$ACTION_")) {
    return typeof value === "string" ? undefined : null;
  }

  return fieldName;
}
