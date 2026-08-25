import { isAbsolute } from "node:path";

import { createGitWorkspaceSnapshot } from "./core/repository.js";

const API_PREFIX = "/dsh-rebased/api";

class DshRebasedApiError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = "DshRebasedApiError";
    this.code = code;
    this.status = status;
  }
}

function writeJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function writeOk(res, value) {
  writeJson(res, 200, { ok: true, value });
}

function writeError(res, error) {
  if (error instanceof DshRebasedApiError) {
    writeJson(res, error.status, { ok: false, error: { code: error.code, message: error.message } });
    return;
  }

  const code = typeof error?.code === "string" ? error.code : "internal-error";
  const message = error instanceof Error ? error.message : String(error);
  const status = code === "missing-git" || code === "git-error" || code === "git-timeout" ? 400 : 500;
  writeJson(res, status, { ok: false, error: { code, message } });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new DshRebasedApiError("payload-too-large", "request body is too large", 413));
      }
    });
    req.on("error", reject);
    req.on("end", () => {
      if (raw.trim() === "") {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new DshRebasedApiError("bad-json", "request body must be JSON"));
      }
    });
  });
}

function requireString(payload, key) {
  const value = payload?.[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new DshRebasedApiError("bad-request", `${key} is required`);
  }
  return value;
}

function sessionCwdOf(ctx, payload) {
  const sessionId = requireString(payload, "sessionId");
  const session = ctx.sessions?.get?.(sessionId);
  const sessionCwd = session?.header?.cwd;
  if (typeof sessionCwd === "string" && sessionCwd !== "") return sessionCwd;

  const clientCwd = payload?.cwd;
  if (typeof clientCwd === "string" && clientCwd !== "") {
    if (!isAbsolute(clientCwd)) {
      throw new DshRebasedApiError("bad-request", "cwd must be absolute");
    }
    return clientCwd;
  }

  return process.cwd();
}

async function dispatch(ctx, method, payload) {
  if (method === "repository.snapshot") {
    return createGitWorkspaceSnapshot(sessionCwdOf(ctx, payload));
  }

  throw new DshRebasedApiError("not-found", `unknown dsh-rebased API method "${method}"`, 404);
}

export function registerHostApi(ctx) {
  return ctx.webServer.register({
    kind: "prefix",
    path: API_PREFIX,
    handler: async (req, res) => {
      if (req.method !== "POST") {
        writeJson(res, 405, { ok: false, error: { code: "method-not-allowed", message: "method not allowed" } });
        return;
      }

      const pathname = new URL(req.url ?? "/", "http://dsh.internal").pathname;
      const method = pathname.startsWith(`${API_PREFIX}/`) ? pathname.slice(API_PREFIX.length + 1) : "";
      if (method === "" || method.includes("/")) {
        writeJson(res, 404, { ok: false, error: { code: "not-found", message: "unknown dsh-rebased API method" } });
        return;
      }

      try {
        writeOk(res, await dispatch(ctx, method, await readJsonBody(req)));
      } catch (error) {
        writeError(res, error);
      }
    },
  });
}
