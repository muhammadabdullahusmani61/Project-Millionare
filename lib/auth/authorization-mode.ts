export type AuthorizationMode = "development" | "production";

export function getAuthorizationMode(): AuthorizationMode {
  const mode = process.env.AUTHORIZATION_MODE?.trim();
  if (mode !== "development" && mode !== "production") {
    throw new Error(
      mode
        ? `Invalid AUTHORIZATION_MODE value: ${mode}. Expected development or production.`
        : "Missing AUTHORIZATION_MODE environment variable.",
    );
  }
  return mode;
}