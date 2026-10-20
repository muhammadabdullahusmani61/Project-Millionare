
import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(({ mode }) => {
  if (mode !== "development" && mode !== "production") {
    throw new Error(
      "Cloudflare config requires --mode development or --mode production."
    );
  }

  return {
    worker: defineWorker({
      name: "program-millionare",
      entrypoint: "vinext/server/fetch-handler",
      compatibilityDate: "2026-10-01",
      compatibilityFlags: ["nodejs_compat"],
      assets: { notFoundHandling: "none" },

      observability: {
        enabled: true,
        headSamplingRate: 1,
        redactQueryString: false,

        logs: {
          enabled: true,
          headSamplingRate: 1,
          invocationLogs: true,
          persist: true,
        },

        traces: {
          enabled: true,
          headSamplingRate: 1,
          persist: true,
        },

        issues: {
          enabled: true,
        },
      },

      env: {
        ASSETS: bindings.assets(),
        AUTHORIZED_USER_ID: bindings.secret(),
        AUTHORIZATION_MODE: bindings.text(mode),
      },
    }),
  };
});
