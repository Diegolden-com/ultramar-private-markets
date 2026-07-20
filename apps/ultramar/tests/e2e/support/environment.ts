import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { LCX_E2E_DEFAULT_PASSWORD } from "./constants";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

export type E2eRuntime = {
  supabaseAdminKey: string;
  appRoot: string;
  password: string;
  supabaseUrl: string;
};

export function loadE2eEnvironment() {
  const appRoot = findUltramarRoot();
  const repositoryRoot = path.resolve(appRoot, "../..");

  for (const filename of [
    path.join(appRoot, ".env.local"),
    path.join(appRoot, ".env"),
    path.join(repositoryRoot, ".env.local"),
    path.join(repositoryRoot, ".env"),
  ]) {
    loadEnvironmentFile(filename);
  }

  return appRoot;
}

export function getE2eRuntime(): E2eRuntime {
  const appRoot = loadE2eEnvironment();
  const supabaseUrl = (
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  ).trim();

  if (!supabaseUrl) {
    throw new Error(
      "LCX E2E requires SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in the environment or apps/ultramar/.env.local.",
    );
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    throw new Error("LCX E2E received an invalid Supabase URL.");
  }

  const isLocal = LOCAL_HOSTS.has(parsedUrl.hostname);
  const supabaseSecretKey = (process.env.SUPABASE_SECRET_KEY ?? "").trim();
  const localServiceRoleKey = isLocal
    ? (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim()
    : "";
  const supabaseAdminKey = supabaseSecretKey || localServiceRoleKey;
  if (!supabaseAdminKey) {
    throw new Error(
      "LCX E2E requires SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY for loopback Supabase) in the environment or apps/ultramar/.env.local.",
    );
  }

  const allowsRemote = process.env.LCX_E2E_ALLOW_REMOTE === "true";
  if (!isLocal && !allowsRemote) {
    throw new Error(
      `Refusing to mutate remote Supabase host ${parsedUrl.hostname}. Set LCX_E2E_ALLOW_REMOTE=true only for an isolated E2E project.`,
    );
  }

  const configuredPassword = process.env.LCX_E2E_PASSWORD?.trim();
  if (!isLocal && !configuredPassword) {
    throw new Error(
      "Remote LCX E2E runs require an explicit LCX_E2E_PASSWORD; the deterministic local default is not allowed remotely.",
    );
  }

  return {
    supabaseAdminKey,
    appRoot,
    password: configuredPassword || LCX_E2E_DEFAULT_PASSWORD,
    supabaseUrl: parsedUrl.toString().replace(/\/$/, ""),
  };
}

function findUltramarRoot() {
  let directory = path.resolve(process.cwd());

  while (true) {
    const directPackage = path.join(directory, "package.json");
    if (isUltramarPackage(directPackage)) return directory;

    const workspacePackage = path.join(directory, "apps", "ultramar", "package.json");
    if (isUltramarPackage(workspacePackage)) return path.dirname(workspacePackage);

    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }

  throw new Error("Could not locate the @ultramar/ultramar workspace for LCX E2E setup.");
}

function isUltramarPackage(filename: string) {
  if (!existsSync(filename)) return false;

  try {
    const packageJson = JSON.parse(readFileSync(filename, "utf8")) as { name?: string };
    return packageJson.name === "@ultramar/ultramar";
  } catch {
    return false;
  }
}

function loadEnvironmentFile(filename: string) {
  if (!existsSync(filename)) return;

  for (const line of readFileSync(filename, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = parseEnvironmentValue(rawValue);
  }
}

function parseEnvironmentValue(rawValue: string) {
  const value = rawValue.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    return value
      .slice(1, -1)
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);

  return value.replace(/\s+#.*$/, "").trim();
}
